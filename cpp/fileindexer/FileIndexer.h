#pragma once

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <thread>
#include <mutex>
#include <atomic>
#include <condition_variable>
#include <filesystem>
#include <queue>
#include <functional>

namespace fs = std::filesystem;

struct FileMetadata {
    std::string path;
    std::string name;
    std::string extension;
    uint64_t size;
    int64_t lastModified;  // Unix timestamp
    bool isDirectory;
};

// Forward declaration
class TrieNode;

class FileSearchEngine {
public:
    FileSearchEngine();
    ~FileSearchEngine();

    // Initialize the index - returns number of files indexed
    int initializeIndex(const std::string& rootPath);
    
    // Search files by query and filters
    std::vector<FileMetadata> search(
        const std::string& query, 
        const std::string& fileType = "",
        uint64_t minSize = 0, 
        uint64_t maxSize = UINT64_MAX,
        int64_t minDate = 0, 
        int64_t maxDate = INT64_MAX
    );
    
    // Update the index with new files (incremental update)
    int updateIndex();
    
    // Get current indexing status
    double getIndexingProgress() const;
    
    // Cancel ongoing indexing
    void cancelIndexing();

private:
    // Root of the file system to index
    std::string m_rootPath;
    
    // Main data structures
    std::unique_ptr<TrieNode> m_fileNameTrie;
    std::unordered_map<std::string, FileMetadata> m_pathToMetadata;
    std::unordered_map<std::string, std::vector<std::string>> m_extensionToFiles;
    
    // Indexing status
    std::atomic<bool> m_isIndexing;
    std::atomic<double> m_indexingProgress;
    std::atomic<bool> m_cancelIndexingRequested;
    
    // Worker thread management
    std::vector<std::thread> m_workerThreads;
    std::queue<fs::path> m_workQueue;
    std::mutex m_queueMutex;
    std::condition_variable m_queueCondition;
    std::atomic<int> m_activeWorkers;
    
    // Methods
    void indexDirectory(const fs::path& dir);
    void workerFunction();
    void addFileToIndex(const fs::path& filePath, const FileMetadata& metadata);
    std::vector<std::string> findInTrie(const std::string& prefix);
    bool matchesFilters(
        const FileMetadata& file,
        const std::string& fileType,
        uint64_t minSize, 
        uint64_t maxSize,
        int64_t minDate, 
        int64_t maxDate
    );
};

// Trie node for prefix search
class TrieNode {
public:
    std::unordered_map<char, std::unique_ptr<TrieNode>> children;
    bool isEndOfWord;
    std::vector<std::string> filePaths;
    
    TrieNode() : isEndOfWord(false) {}
};