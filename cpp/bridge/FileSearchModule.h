#pragma once

#include <jsi/jsi.h>
#include "FileIndexer.h"
#include <memory>

namespace filefinder {

using namespace facebook::jsi;

class FileSearchBinding {
public:
    FileSearchBinding();
    ~FileSearchBinding();
    
    // Initialize JSI bindings
    void install(Runtime& jsiRuntime);
    
private:
    // Our search engine instance
    std::unique_ptr<FileSearchEngine> m_searchEngine;
    
    // JSI binding methods
    Value initializeIndex(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count);
    Value search(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count);
    Value updateIndex(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count);
    Value getIndexingStatus(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count);
    Value cancelIndexing(Runtime& runtime, const Value& thisValue, const Value* arguments, size_t count);
    
    // Helper functions
    Object fileMetadataToJSObject(Runtime& runtime, const FileMetadata& metadata);
};

} // namespace filefinder