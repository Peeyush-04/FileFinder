"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  TextInput,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../contexts/ThemeContext"
import { useFileSearch } from "../hooks/useFileSearch"
import { getDefaultDirectory } from "../utils/fileHelpers"

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation()
  const { theme, isDark, setTheme, toggleTheme } = useTheme()
  const { initializeIndex, cancelIndexing } = useFileSearch()

  const [customPath, setCustomPath] = useState("")

  const handleResetIndex = () => {
    Alert.alert(
      "Reset Index",
      "Are you sure you want to reset the file index? This will clear all indexed files and start fresh.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            const defaultDir = getDefaultDirectory()
            initializeIndex(defaultDir)
            Alert.alert("Index Reset", "File index has been reset.")
          },
        },
      ],
    )
  }

  const handleCustomPathIndex = () => {
    if (!customPath) {
      Alert.alert("Error", "Please enter a valid path")
      return
    }

    initializeIndex(customPath)
    Alert.alert("Indexing Started", `Indexing directory: ${customPath}`)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f5f5" }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={isDark ? "#ffffff" : "#000000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? "#ffffff" : "#000000" }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: isDark ? "#1f1f1f" : "#ffffff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#ffffff" : "#000000" }]}>Appearance</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: isDark ? "#ffffff" : "#000000" }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: "#4A90E2" }}
              thumbColor={"#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: isDark ? "#ffffff" : "#000000" }]}>Theme</Text>
            <View style={styles.themeSelector}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === "light" && styles.selectedThemeOption,
                  { borderColor: isDark ? "#333333" : "#e0e0e0" },
                ]}
                onPress={() => setTheme("light")}
              >
                <Text style={{ color: isDark ? "#ffffff" : "#000000" }}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === "dark" && styles.selectedThemeOption,
                  { borderColor: isDark ? "#333333" : "#e0e0e0" },
                ]}
                onPress={() => setTheme("dark")}
              >
                <Text style={{ color: isDark ? "#ffffff" : "#000000" }}>Dark</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === "system" && styles.selectedThemeOption,
                  { borderColor: isDark ? "#333333" : "#e0e0e0" },
                ]}
                onPress={() => setTheme("system")}
              >
                <Text style={{ color: isDark ? "#ffffff" : "#000000" }}>System</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Indexing Section */}
        <View style={[styles.section, { backgroundColor: isDark ? "#1f1f1f" : "#ffffff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#ffffff" : "#000000" }]}>File Indexing</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: isDark ? "#ffffff" : "#000000" }]}>Default Directory</Text>
            <Text style={[styles.settingValue, { color: isDark ? "#b0b0b0" : "#666666" }]}>
              {getDefaultDirectory()}
            </Text>
          </View>

          <View style={styles.customPathContainer}>
            <Text style={[styles.settingLabel, { color: isDark ? "#ffffff" : "#000000" }]}>Custom Directory</Text>
            <TextInput
              style={[
                styles.customPathInput,
                {
                  color: isDark ? "#ffffff" : "#000000",
                  borderColor: isDark ? "#333333" : "#e0e0e0",
                  backgroundColor: isDark ? "#2a2a2a" : "#f9f9f9",
                },
              ]}
              placeholder="Enter custom path to index"
              placeholderTextColor={isDark ? "#b0b0b0" : "#999999"}
              value={customPath}
              onChangeText={setCustomPath}
            />
            <TouchableOpacity
              style={[styles.customPathButton, { backgroundColor: "#4A90E2" }]}
              onPress={handleCustomPathIndex}
            >
              <Text style={styles.customPathButtonText}>Index</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isDark ? "#333333" : "#f0f0f0" }]}
              onPress={handleResetIndex}
            >
              <Icon name="refresh-cw" size={16} color="#4A90E2" style={styles.actionButtonIcon} />
              <Text style={[styles.actionButtonText, { color: "#4A90E2" }]}>Reset Index</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isDark ? "#333333" : "#f0f0f0" }]}
              onPress={cancelIndexing}
            >
              <Icon name="x-circle" size={16} color="#E25149" style={styles.actionButtonIcon} />
              <Text style={[styles.actionButtonText, { color: "#E25149" }]}>Cancel Indexing</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: isDark ? "#1f1f1f" : "#ffffff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#ffffff" : "#000000" }]}>About</Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: isDark ? "#ffffff" : "#000000" }]}>Version</Text>
            <Text style={[styles.settingValue, { color: isDark ? "#b0b0b0" : "#666666" }]}>1.0.0</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: isDark ? "#ffffff" : "#000000" }]}>Build</Text>
            <Text style={[styles.settingValue, { color: isDark ? "#b0b0b0" : "#666666" }]}>2023.02.15</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
  },
  themeSelector: {
    flexDirection: "row",
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    marginLeft: 8,
    borderRadius: 4,
  },
  selectedThemeOption: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  customPathContainer: {
    marginTop: 16,
  },
  customPathInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  customPathButton: {
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  customPathButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    fontWeight: "500",
  },
})

export default SettingsScreen

