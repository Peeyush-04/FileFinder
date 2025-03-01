"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  BackHandler,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"
import * as FileSystem from "expo-file-system"
import { useTheme } from "../contexts/ThemeContext"

// Components
import SearchBar from "../components/SearchBar"
import FileList from "../components/FileList"
import FilterModal from "../components/FilterModal"
import SortButton, { type SortOption, type SortDirection } from "../components/SortButton"

// File Metadata Type
interface FileMetadata {
  path: string
  name: string
  extension: string
  size: number
  lastModified: number
  isDirectory: boolean
}

// Recursive function to scan a directory
const scanDirectory = async (directory: string): Promise<FileMetadata[]> => {
  let results: FileMetadata[] = []
  try {
    const fileList = await FileSystem.readDirectoryAsync(directory)
    for (const fileName of fileList) {
      const fileUri = `${directory}/${fileName}`
      const info = await FileSystem.getInfoAsync(fileUri)
      // Build metadata for the file
      const fileMeta: FileMetadata = {
        path: fileUri,
        name: fileName,
        extension: fileName.includes(".") ? fileName.split(".").pop() || "" : "",
        size: info.exists ? info.size || 0 : 0,
        lastModified: info.exists ? info.modificationTime || 0 : 0,
        isDirectory: info.exists ? info.isDirectory || false : false,
      }
      results.push(fileMeta)
      // If it's a directory, recursively scan it
      if (info.exists && info.isDirectory) {
        const subFiles = await scanDirectory(fileUri)
        results = results.concat(subFiles)
      }
    }
  } catch (error) {
    console.error("Error scanning directory:", error)
    throw error
  }
  return results
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation()
  const { isDark } = useTheme()

  const [files, setFiles] = useState<FileMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPath, setCurrentPath] = useState<string>(FileSystem.documentDirectory || "")

  // Load the entire document directory recursively
  const loadFiles = useCallback(async (directory: string) => {
    if (!directory) {
      console.warn("Invalid directory path")
      return
    }
    setIsLoading(true)
    try {
      const scannedFiles = await scanDirectory(directory)
      setFiles(scannedFiles)
    } catch (error) {
      console.error("Error loading files:", error)
      Alert.alert("Error", "Failed to load files.")
    }
    setIsLoading(false)
  }, [])

  // Request storage permission (Android only)
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: "File Finder Storage Permission",
              message: "File Finder needs access to your storage to find files.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            loadFiles(currentPath)
          } else {
            Alert.alert("Permission Denied", "File Finder needs storage access to function properly.")
          }
        } catch (err) {
          console.warn("Error requesting permission:", err)
        }
      } else {
        loadFiles(currentPath)
      }
    }
    requestPermissions()
  }, [currentPath, loadFiles])

  // Listen for Android hardware back button to navigate up a directory
  useEffect(() => {
    const onBackPress = () => {
      // If already at root, allow default behavior
      if (currentPath === FileSystem.documentDirectory) return false
      // Navigate up one directory
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"))
      setCurrentPath(parentPath)
      loadFiles(parentPath)
      return true // Prevent default back behavior
    }

    BackHandler.addEventListener("hardwareBackPress", onBackPress)
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [currentPath, loadFiles])

  // Handle file search filtering
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFiles(filteredFiles)
    } else {
      loadFiles(currentPath)
    }
  }, [searchQuery])

  // Handle sorting files
  useEffect(() => {
    const sorted = [...files].sort((a, b) => {
      let comparison = 0
      switch (sortOption) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "date":
          comparison = a.lastModified - b.lastModified
          break
        case "size":
          comparison = a.size - b.size
          break
        case "type":
          comparison = a.extension.localeCompare(b.extension)
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
    setFiles(sorted)
  }, [sortOption, sortDirection])

  // Handle file press
  const handleFilePress = (file: FileMetadata) => {
    if (file.isDirectory) {
      setCurrentPath(file.path)
      loadFiles(file.path)
    } else {
      Alert.alert(
        file.name,
        `Path: ${file.path}\nSize: ${file.size} bytes\nLast Modified: ${new Date(
          file.lastModified
        ).toLocaleString()}`
      )
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f5f5" }]}>
      <View style={styles.header}>
        <View style={styles.pathContainer}>
          <TouchableOpacity
            onPress={() => {
              if (currentPath !== FileSystem.documentDirectory) {
                const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"))
                setCurrentPath(parentPath)
                loadFiles(parentPath)
              }
            }}
            disabled={currentPath === FileSystem.documentDirectory}
            style={styles.backButton}
          >
            <Icon
              name="chevron-left"
              size={24}
              color={currentPath === FileSystem.documentDirectory ? "#555555" : "#ffffff"}
            />
          </TouchableOpacity>
          <Text style={[styles.pathText, { color: isDark ? "#ffffff" : "#000000" }]} numberOfLines={1}>
            {currentPath}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Settings" as never)} style={styles.settingsButton}>
            <Icon name="settings" size={20} color={isDark ? "#ffffff" : "#000000"} />
          </TouchableOpacity>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setFilterModalVisible(true)}
          onClearPress={() => setSearchQuery("")}
        />

        <SortButton
          currentSort={sortOption}
          currentDirection={sortDirection}
          onSortChange={(option, direction) => {
            setSortOption(option)
            setSortDirection(direction)
          }}
        />
      </View>

      <FileList
        files={files}
        isLoading={isLoading}
        onFilePress={handleFilePress}
        ListEmptyComponent={<Text>No files found</Text>}
      />

      <FilterModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)} onApply={() => {}} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 8, paddingBottom: 8 },
  pathContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 8 },
  backButton: { padding: 4 },
  pathText: { flex: 1, fontSize: 14, marginHorizontal: 8 },
  settingsButton: { padding: 4 },
})

export default HomeScreen
