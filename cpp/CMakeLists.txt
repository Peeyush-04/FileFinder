cmake_minimum_required(VERSION 3.10)
project(FileFinderEngine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# File indexer library
add_library(fileindexer STATIC
    fileindexer/FileIndexer.cpp
)

target_include_directories(fileindexer PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/fileindexer
)

# React Native bridge
add_library(filefinder_jsi SHARED
    bridge/FileSearchModule.cpp
)

find_package(ReactAndroid REQUIRED CONFIG)
target_link_libraries(filefinder_jsi
    ReactAndroid::jsi
    fileindexer
)

target_include_directories(filefinder_jsi PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/fileindexer
    ${CMAKE_CURRENT_SOURCE_DIR}/bridge
)