"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"

type ThemeType = "light" | "dark" | "system"

interface ThemeContextType {
  theme: ThemeType
  isDark: boolean
  setTheme: (theme: ThemeType) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [theme, setTheme] = useState<ThemeType>("system")

  // Determine if we should use dark mode
  const isDark = theme === "system" ? systemColorScheme === "dark" : theme === "dark"

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "system") return "light"
      if (prev === "light") return "dark"
      return "system"
    })
  }

  // Load theme from storage on mount
  useEffect(() => {
    // In a real app, you would load from AsyncStorage here
    // For now, we'll just use the system default
  }, [])

  // Save theme to storage when it changes
  useEffect(() => {
    // In a real app, you would save to AsyncStorage here
  }, [])

  return <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

