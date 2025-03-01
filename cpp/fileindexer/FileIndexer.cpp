#include "FileIndexer.h"
#include <algorithm>
#include <chrono>
#include <thread>
#include <iostream>

FileSearchEngine::FileSearchEngine() 
    : m_fileNameTrie(std::make_unique<TrieNode>()),
      m_isIndexing(false),
      m_indexingProgress(0.0),
      m_cancelIndexingRequested(false),
      m_activeWorkers(0) {
}

FileSearchEngine::~FileSearchEngine() {
    cancelIndexing();
    
    // Join all worker threads
    for (auto& thread : m_workerThreads) {
        if (thread.joinable()) {
            thread.join();
        }
    }
}

int FileSearchEngine::initializeIndex(const std::string& rootPath) {
    if (m_isIndexing) {
        cancelIndexing();
    }
    
    // Reset data structures
    m_rootPath = rootPath;
    m_fileNameTrie = std::make_unique<TrieNode>();
    m_pathToMetadata.clear();
    m_extensionToFiles.clear();
    
    m_isIndexing = true;
    m_indexingProgress = 0.0;
    m_cancelIndexingRequested = false;
    
    // Start indexing in a separate thread
    m_workQueue = std::queue<fs::path>();  // Clear the queue
    m_workQueue.push(fs::path(rootPath));
    
    // Create worker threads (use hardware concurrency)
    unsigned int numThreads = std::thread::hardware_concurrency();
    numThreads = numThreads > 0 ? numThreads : 4;  // Default to 4 if not detected
    
    m_activeWorkers = numThreads;
    
    for (unsigned int i = 0; i < numThreads; i++) {
        m_workerThreads.emplace_back(&FileSearchEngine::workerFunction, this);
    }
    
    return 0;  // Return immediately, indexing continues in background
}

void FileSearchEngine::workerFunction() {
    while (!m_cancelIndexingRequested) {
        fs::path currentPath;
        
        {
            std::unique_lock<std::mutex> lock(m_queueMutex);
            
            // Wait until there's work or indexing is cancelled
            m_queueCondition.wait(lock, [this] {
                return !m_workQueue.empty() || m_cancelIndexingRequested;
            });
            
            if (m_cancelIndexingRequested) {
                break;
            }
            
            if (m_workQueue.empty()) {
                continue;
            }
            
            currentPath = m_workQueue.front();
            m_workQueue.pop();
        }
        
        try {
            // Process directory
            if (fs::is_directory(currentPath)) {
                for (const auto& entry : fs::directory_iterator(currentPath)) {
                    if (m_cancelIndexingRequested) {
                        break;
                    }
                    
                    if (fs::is_directory(entry)) {
                        // Add directory to queue
                        std::lock_guard<std::mutex> lock(m_queueMutex);
                        m_workQueue.push(entry.path());
                        m_queueCondition.notify_one();
                    } else if (fs::is_regular_file(entry)) {
                        // Process file
                        FileMetadata metadata;
                        metadata.path = entry.path().string();
                        metadata.name = entry.path().filename().string();
                        metadata.extension = entry.path().extension().string();
                        metadata.isDirectory = false;
                        
                        try {
                            metadata.size = fs::file_size(entry);
                            auto lastWriteTime = fs::last_write_time(entry);
                            auto systemTime = std::chrono::file_clock::to_sys(lastWriteTime);
                            metadata.lastModified = std::chrono::duration_cast<std::chrono::seconds>(
                                systemTime.time_since_epoch()).count();
                        } catch (const std::exception& e) {
                            // Handle errors gracefully
                            metadata.size = 0;
                            metadata.lastModified = 0;
                        }
                        
                        addFileToIndex(entry.path(), metadata);
                    }
                }
            }
        } catch (const std::exception& e) {
            // Skip problematic directories
        }
        
        // Check if all work is done
        {
            std::lock_guard<std::mutex> lock(m_queueMutex);
            if (m_workQueue.empty()) {
                if (--m_activeWorkers == 0) {
                    // All workers finished, indexing is complete
                    m_isIndexing = false;
                    m_indexingProgress = 1.0;
                    break;
                }
            }
        }
    }
}

void FileSearchEngine::addFileToIndex(const fs::path& filePath, const FileMetadata& metadata) {
    std::string filename = metadata.name;
    std::string path = metadata.path;
    std::string extension = metadata.extension;
    
    // Add to path map
    {
        std::lock_guard<std::mutex> lock(m_queueMutex);  // Reuse the queue mutex for all data structures
        m_pathToMetadata[path] = metadata;
        
        // Add to extension map (lowercase extension for case-insensitive search)
        std::string lowerExt = extension;
        std::transform(lowerExt.begin(), lowerExt.end(), lowerExt.begin(), ::tolower);
        if (!lowerExt.empty()) {
            if (lowerExt[0] == '.') {
                lowerExt = lowerExt.substr(1);  // Remove leading dot
            }
            m_extensionToFiles[lowerExt].push_back(path);
        }
        
        // Add to Trie
        TrieNode* current = m_fileNameTrie.get();
        for (char c : filename) {
            char lowerC = std::tolower(c);  // Case-insensitive search
            if (current->children.find(lowerC) == current->children.end()) {
                current->children[lowerC] = std::make_unique<TrieNode>();
            }
            current = current->children[lowerC].get();
        }
        current->isEndOfWord = true;
        current->filePaths.push_back(path);
    }
}

std::vector<FileMetadata> FileSearchEngine::search(
    const std::string& query, 
    const std::string& fileType,
    uint64_t minSize, 
    uint64_t maxSize,
    int64_t minDate, 
    int64_t maxDate) {
    
    std::vector<std::string> matchingPaths;
    
    if (query.empty() && fileType.empty() && minSize == 0 && 
        maxSize == UINT64_MAX && minDate == 0 && maxDate == INT64_MAX) {
        // Return all files if no filters specified (up to a reasonable limit)
        matchingPaths.reserve(std::min(size_t(1000), m_pathToMetadata.size()));
        for (const auto& pair : m_pathToMetadata) {
            if (matchingPaths.size() >= 1000) break;
            matchingPaths.push_back(pair.first);
        }
    } else if (!query.empty()) {
        // Search by filename prefix in trie
        matchingPaths = findInTrie(query);
    } else if (!fileType.empty()) {
        // Search by file type
        std::string lowerType = fileType;
        std::transform(lowerType.begin(), lowerType.end(), lowerType.begin(), ::tolower);
        
        auto it = m_extensionToFiles.find(lowerType);
        if (it != m_extensionToFiles.end()) {
            matchingPaths = it->second;
        }
    }
    
    // Apply additional filters
    std::vector<FileMetadata> results;
    for (const auto& path : matchingPaths) {
        auto it = m_pathToMetadata.find(path);
        if (it != m_pathToMetadata.end()) {
            const FileMetadata& metadata = it->second;
            if (matchesFilters(metadata, fileType, minSize, maxSize, minDate, maxDate)) {
                results.push_back(metadata);
            }
        }
    }
    
    // Sort results by name
    std::sort(results.begin(), results.end(), [](const FileMetadata& a, const FileMetadata& b) {
        return a.name < b.name;
    });
    
    return results;
}

std::vector<std::string> FileSearchEngine::findInTrie(const std::string& prefix) {
    std::vector<std::string> results;
    
    // Traverse trie to find the prefix
    TrieNode* current = m_fileNameTrie.get();
    std::string lowerPrefix = prefix;
    std::transform(lowerPrefix.begin(), lowerPrefix.end(), lowerPrefix.begin(), ::tolower);
    
    for (char c : lowerPrefix) {
        if (current->children.find(c) == current->children.end()) {
            return results;  // Prefix not found
        }
        current = current->children[c].get();
    }
    
    // Collect all paths under this prefix
    std::function<void(TrieNode*, std::vector<std::string>&)> collectPaths = 
        [&collectPaths](TrieNode* node, std::vector<std::string>& paths) {
            if (node->isEndOfWord) {
                paths.insert(paths.end(), node->filePaths.begin(), node->filePaths.end());
            }
            
            for (const auto& pair : node->children) {
                collectPaths(pair.second.get(), paths);
            }
        };
    
    collectPaths(current, results);
    return results;
}

bool FileSearchEngine::matchesFilters(
    const FileMetadata& file,
    const std::string& fileType,
    uint64_t minSize, 
    uint64_t maxSize,
    int64_t minDate, 
    int64_t maxDate) {
    
    // Check file size
    if (file.size < minSize || file.size > maxSize) {
        return false;
    }
    
    // Check modification date
    if (file.lastModified < minDate || file.lastModified > maxDate) {
        return false;
    }
    
    // Check file type if specified
    if (!fileType.empty()) {
        std::string extension = file.extension;
        if (extension.size() > 0 && extension[0] == '.') {
            extension = extension.substr(1);  // Remove leading dot
        }
        
        std::transform(extension.begin(), extension.end(), extension.begin(), ::tolower);
        
        std::string lowerType = fileType;
        std::transform(lowerType.begin(), lowerType.end(), lowerType.begin(), ::tolower);
        
        if (extension != lowerType) {
            return false;
        }
    }
    
    return true;
}

int FileSearchEngine::updateIndex() {
    // For incremental updates, we would need to track last modified times
    // This is a simplified version that just re-indexes
    return initializeIndex(m_rootPath);
}

double FileSearchEngine::getIndexingProgress() const {
    return m_indexingProgress;
}

void FileSearchEngine::cancelIndexing() {
    m_cancelIndexingRequested = true;
    m_queueCondition.notify_all();
    
    // Wait for all threads to finish
    for (auto& thread : m_workerThreads) {
        if (thread.joinable()) {
            thread.join();
        }
    }
    
    m_workerThreads.clear();
    m_isIndexing = false;
    m_cancelIndexingRequested = false;
}