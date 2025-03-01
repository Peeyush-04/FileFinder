import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import type { FileMetadata } from "../native/FileSearchEngine"
import { formatFileSize, formatRelativeTime } from "../utils/formatters"
import { getFileIcon } from "../utils/fileHelpers"
import { useTheme } from "../contexts/ThemeContext"

interface FileItemProps {
  file: FileMetadata
  onPress: (file: FileMetadata) => void
  onLongPress?: (file: FileMetadata) => void
}

const FileItem: React.FC<FileItemProps> = ({ file, onPress, onLongPress }) => {
  const { isDark } = useTheme()
  const iconName = getFileIcon(file)

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: isDark ? "#1f1f1f" : "#ffffff" }]}
      onPress={() => onPress(file)}
      onLongPress={() => onLongPress?.(file)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={24} color={file.isDirectory ? "#FFD700" : "#4A90E2"} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.fileName, { color: isDark ? "#ffffff" : "#000000" }]} numberOfLines={1}>
          {file.name}
        </Text>
        <View style={styles.detailsContainer}>
          {!file.isDirectory && (
            <Text style={[styles.fileSize, { color: isDark ? "#b0b0b0" : "#666666" }]}>
              {formatFileSize(file.size)}
            </Text>
          )}
          <Text style={[styles.fileDate, { color: isDark ? "#b0b0b0" : "#666666" }]}>
            {formatRelativeTime(file.lastModified)}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={isDark ? "#b0b0b0" : "#999999"} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
  },
  detailsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  fileSize: {
    fontSize: 12,
    marginRight: 8,
  },
  fileDate: {
    fontSize: 12,
  },
})

export default FileItem

