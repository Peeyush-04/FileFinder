"use client"

import type React from "react"
import { useState } from "react"
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useTheme } from "../contexts/ThemeContext"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onFilterPress: () => void
  onClearPress: () => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  onClearPress,
  placeholder = "Search files...",
}) => {
  const { isDark } = useTheme()
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
          borderColor: isDark ? "#333333" : "#e0e0e0",
          shadowOpacity: isDark ? 0.1 : 0.2,
        },
        isFocused && {
          borderColor: isDark ? "#4A90E2" : "#4A90E2",
        },
      ]}
    >
      <Icon name="search" size={20} color={isDark ? "#b0b0b0" : "#999999"} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { color: isDark ? "#ffffff" : "#000000" }]}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#b0b0b0" : "#999999"}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClearPress} style={styles.clearButton}>
          <Icon name="x" size={18} color={isDark ? "#b0b0b0" : "#999999"} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
        <Icon name="filter" size={20} color="#4A90E2" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    padding: 4,
    marginLeft: 8,
  },
})

export default SearchBar

