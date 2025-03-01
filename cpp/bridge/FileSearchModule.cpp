#include "FileSearchModule.h"
#include <vector>
#include <string>

namespace filefinder {

FileSearchBinding::FileSearchBinding() 
    : m_searchEngine(std::make_unique<FileSearchEngine>()) {
}

FileSearchBinding::~FileSearchBinding() {
}

void FileSearchBinding::install(Runtime& runtime) {
    auto fileSearchObject = Object(runtime);
    
    // Add methods to the object
    auto initIndexMethod = Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "initializeIndex"),
        1,  // Number of arguments
        [this](Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
            return this->initializeIndex(runtime, thisValue, arguments, count);
        }
    );
    fileSearchObject.setProperty(runtime, "initializeIndex", initIndexMethod);
    
    auto searchMethod = Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "search"),
        6,  // Number of arguments (query, fileType, minSize, maxSize, minDate, maxDate)
        [this](Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
            return this->search(runtime, thisValue, arguments, count);
        }
    );
    fileSearchObject.setProperty(runtime, "search", searchMethod);
    
    auto updateIndexMethod = Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "updateIndex"),
        0,  // Number of arguments
        [this](Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
            return this->updateIndex(runtime, thisValue, arguments, count);
        }
    );
    fileSearchObject.setProperty(runtime, "updateIndex", updateIndexMethod);
    
    auto getStatusMethod = Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "getIndexingStatus"),
        0,  // Number of arguments
        [this](Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
            return this->getIndexingStatus(runtime, thisValue, arguments, count);
        }
    );
    fileSearchObject.setProperty(runtime, "getIndexingStatus", getStatusMethod);
    
    auto cancelMethod = Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "cancelIndexing"),
        0,  // Number of arguments
        [this](Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
            return this->cancelIndexing(runtime, thisValue, arguments, count);
        }
    );
    fileSearchObject.setProperty(runtime, "cancelIndexing", cancelMethod);
    
    // Attach to global object
    runtime.global().setProperty(runtime, "FileSearchEngine", fileSearchObject);
}

Value FileSearchBinding::initializeIndex(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
    if (count < 1 || !arguments[0].isString()) {
        throw JSError(runtime, "initializeIndex requires a string rootPath argument");
    }
    
    std::string rootPath = arguments[0].asString(runtime).utf8(runtime);
    int result = m_searchEngine->initializeIndex(rootPath);
    
    return Value(result);
}

Value FileSearchBinding::search(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
    // Default values
    std::string query = "";
    std::string fileType = "";
    uint64_t minSize = 0;
    uint64_t maxSize = UINT64_MAX;
    int64_t minDate = 0;
    int64_t maxDate = INT64_MAX;
    
    // Extract arguments
    if (count > 0 && arguments[0].isString()) {
        query = arguments[0].asString(runtime).utf8(runtime);
    }
    
    if (count > 1 && arguments[1].isString()) {
        fileType = arguments[1].asString(runtime).utf8(runtime);
    }
    
    if (count > 2 && arguments[2].isNumber()) {
        minSize = static_cast<uint64_t>(arguments[2].asNumber());
    }
    
    if (count > 3 && arguments[3].isNumber()) {
        maxSize = static_cast<uint64_t>(arguments[3].asNumber());
    }
    
    if (count > 4 && arguments[4].isNumber()) {
        minDate = static_cast<int64_t>(arguments[4].asNumber());
    }
    
    if (count > 5 && arguments[5].isNumber()) {
        maxDate = static_cast<int64_t>(arguments[5].asNumber());
    }
    
    // Perform search
    std::vector<FileMetadata> results = m_searchEngine->search(
        query, fileType, minSize, maxSize, minDate, maxDate);
    
    // Convert results to JS array
    auto jsResults = Array(runtime, results.size());
    
    for (size_t i = 0; i < results.size(); i++) {
        jsResults.setValueAtIndex(runtime, i, fileMetadataToJSObject(runtime, results[i]));
    }
    
    return jsResults;
}

Object FileSearchBinding::fileMetadataToJSObject(Runtime& runtime, const FileMetadata& metadata) {
    auto obj = Object(runtime);
    
    obj.setProperty(runtime, "path", String::createFromUtf8(runtime, metadata.path));
    obj.setProperty(runtime, "name", String::createFromUtf8(runtime, metadata.name));
    obj.setProperty(runtime, "extension", String::createFromUtf8(runtime, metadata.extension));
    obj.setProperty(runtime, "size", Value(static_cast<double>(metadata.size)));
    obj.setProperty(runtime, "lastModified", Value(static_cast<double>(metadata.lastModified)));
    obj.setProperty(runtime, "isDirectory", Value(metadata.isDirectory));
    
    return obj;
}

Value FileSearchBinding::updateIndex(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
    int result = m_searchEngine->updateIndex();
    return Value(result);
}

Value FileSearchBinding::getIndexingStatus(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
    double progress = m_searchEngine->getIndexingProgress();
    return Value(progress);
}

Value FileSearchBinding::cancelIndexing(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count) {
    m_searchEngine->cancelIndexing();
    return Value(true);
}

} // namespace filefinder