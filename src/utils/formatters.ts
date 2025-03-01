// Format file size to human-readable format
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B"
  
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
  
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
  
  // Format date to human-readable format
  export function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  // Format time to human-readable format
  export function formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  
  // Format date and time to human-readable format
  export function formatDateTime(timestamp: number): string {
    return `${formatDate(timestamp)} ${formatTime(timestamp)}`
  }
  
  // Format relative time (e.g., "2 days ago")
  export function formatRelativeTime(timestamp: number): string {
    const now = Date.now() / 1000
    const diff = now - timestamp
  
    if (diff < 60) {
      return "Just now"
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (diff < 604800) {
      const days = Math.floor(diff / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (diff < 2592000) {
      const weeks = Math.floor(diff / 604800)
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    } else if (diff < 31536000) {
      const months = Math.floor(diff / 2592000)
      return `${months} month${months > 1 ? "s" : ""} ago`
    } else {
      const years = Math.floor(diff / 31536000)
      return `${years} year${years > 1 ? "s" : ""} ago`
    }
  }
  
  