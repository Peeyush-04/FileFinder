"use client"

import type React from "react"
import { useState } from "react"
import { FlatList, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from "react-native"
import type { FileMetadata } from "../native/FileSearchEngine"
import FileItem from "./FileItem"
import { useTheme } from "../contexts/ThemeContext"

interface FileListProps {
  files: FileMetadata[]
  isLoading: boolean
  onFilePress: (file: FileMetadata) => void
  onFileLongPress?: (file: FileMetadata) => void
  onRefresh?: () => void
  ListEmptyComponent?: React.ReactElement
}

const FileList: React.FC<FileListProps> = ({
  files,
  isLoading,
  onFilePress,
  onFileLongPress,
  onRefresh,
  ListEmptyComponent,
}) => {
  const { isDark } = useTheme()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true)
      await onRefresh()
      setRefreshing(false)
    }
  }

  if (isLoading && files.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={[styles.loadingText, { color: isDark ? "#ffffff" : "#000000" }]}>Loading files...</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={files}
      keyExtractor={(item) => item.path}
      renderItem={({ item }) => <FileItem file={item} onPress={onFilePress} onLongPress={onFileLongPress} />}
      contentContainerStyle={[styles.listContent, files.length === 0 && styles.emptyList]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4A90E2"]}
            tintColor={isDark ? "#ffffff" : "#4A90E2"}
          />
        ) : undefined
      }
      ListEmptyComponent={!isLoading ? ListEmptyComponent : null}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
  emptyList: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
})

export default FileList

