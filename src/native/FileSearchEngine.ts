import * as FileSystem from "expo-file-system";

export interface FileMetadata {
  path: string;
  name: string;
  extension: string;
  size: number;
  lastModified: number;
  isDirectory: boolean;
}

export interface FileSearchEngineInterface {
  initializeIndex: (rootPath: string) => Promise<number>;
  search: (query: string) => Promise<FileMetadata[]>;
}

class RealFileSearchEngine implements FileSearchEngineInterface {
  async initializeIndex(rootPath: string): Promise<number> {
    console.log(`Indexing started for: ${rootPath}`);
    return 0; // You can later improve this to cache indexed files
  }

  async search(query: string): Promise<FileMetadata[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory || "");

      return await Promise.all(
        files
          .filter(file => file.toLowerCase().includes(query.toLowerCase()))
          .map(async file => {
            const filePath = `${FileSystem.documentDirectory}${file}`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);

            return {
              path: filePath,
              name: file,
              extension: file.includes(".") ? file.split(".").pop() || "" : "",
              size: fileInfo.exists ? fileInfo.size || 0 : 0, // ✅ FIX: Check `exists` before accessing size
              lastModified: fileInfo.exists ? fileInfo.modificationTime || 0 : 0, // ✅ FIX: Check `exists` before accessing modificationTime
              isDirectory: fileInfo.exists ? fileInfo.isDirectory || false : false,
            };
          })
      );
    } catch (error) {
      console.error("Error reading files:", error);
      return [];
    }
  }
}

export default new RealFileSearchEngine();
