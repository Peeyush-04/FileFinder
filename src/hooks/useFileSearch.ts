import { useState, useEffect } from "react";
import { NativeModules } from "react-native";

const { FileSearchEngine } = NativeModules;

export interface FileMetadata {
  path: string;
  name: string;
  extension: string;
  size: number;
  lastModified: number;
  isDirectory: boolean;
}

export const useFileSearch = () => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const initializeIndex = async (rootPath: string) => {
    setIsLoading(true);
    try {
      await FileSearchEngine.initializeIndex(rootPath);
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing index:", error);
      setIsLoading(false);
      throw error; // Re-throw to handle in the UI
    }
  };

  const searchFiles = async (query: string) => {
    setIsLoading(true);
    try {
      const results = await FileSearchEngine.search(query, "", 0, Number.MAX_SAFE_INTEGER, 0, Date.now() / 1000);
      setFiles(results);
    } catch (error) {
      console.error("Error searching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelIndexing = () => {
    try {
      FileSearchEngine.cancelIndexing();
    } catch (error) {
      console.error("Error canceling indexing:", error);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchFiles(searchQuery);
    }
  }, [searchQuery]);

  return { files, isLoading, searchQuery, setSearchQuery, initializeIndex, cancelIndexing };
};