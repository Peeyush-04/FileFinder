import type { FileMetadata } from "../native/FileSearchEngine"
import { Platform } from "react-native"

// Get file icon based on extension
export function getFileIcon(file: FileMetadata): string {
  if (file.isDirectory) {
    return "folder"
  }

  const extension = file.extension.toLowerCase().replace(".", "")

  switch (extension) {
    case "pdf":
      return "file-pdf"
    case "doc":
    case "docx":
      return "file-text"
    case "xls":
    case "xlsx":
      return "file-spreadsheet"
    case "ppt":
    case "pptx":
      return "file-presentation"
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
      return "image"
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
      return "music"
    case "mp4":
    case "avi":
    case "mov":
    case "mkv":
      return "video"
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "archive"
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "html":
    case "css":
    case "json":
      return "code"
    default:
      return "file"
  }
}

// Get default directory for indexing based on platform
export function getDefaultDirectory(): string {
  if (Platform.OS === "android") {
    return "/storage/emulated/0" // Android external storage
  } else if (Platform.OS === "ios") {
    return "/var/mobile/Documents" // iOS documents directory
  } else {
    return "/" // Default for other platforms
  }
}

// Check if a file is a media file that can be previewed
export function isPreviewable(file: FileMetadata): boolean {
  if (file.isDirectory) return false

  const extension = file.extension.toLowerCase().replace(".", "")
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"]
  const videoExtensions = ["mp4", "mov"]
  const audioExtensions = ["mp3", "wav"]
  const documentExtensions = ["pdf", "txt"]

  return (
    imageExtensions.includes(extension) ||
    videoExtensions.includes(extension) ||
    audioExtensions.includes(extension) ||
    documentExtensions.includes(extension)
  )
}

// Get MIME type for a file
export function getMimeType(file: FileMetadata): string {
  const extension = file.extension.toLowerCase().replace(".", "")

  switch (extension) {
    case "pdf":
      return "application/pdf"
    case "doc":
      return "application/msword"
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    case "xls":
      return "application/vnd.ms-excel"
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    case "ppt":
      return "application/vnd.ms-powerpoint"
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "png":
      return "image/png"
    case "gif":
      return "image/gif"
    case "bmp":
      return "image/bmp"
    case "svg":
      return "image/svg+xml"
    case "mp3":
      return "audio/mpeg"
    case "wav":
      return "audio/wav"
    case "ogg":
      return "audio/ogg"
    case "mp4":
      return "video/mp4"
    case "avi":
      return "video/x-msvideo"
    case "mov":
      return "video/quicktime"
    case "txt":
      return "text/plain"
    case "html":
      return "text/html"
    case "css":
      return "text/css"
    case "js":
      return "application/javascript"
    case "json":
      return "application/json"
    default:
      return "application/octet-stream"
  }
}

