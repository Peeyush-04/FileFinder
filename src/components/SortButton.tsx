"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useTheme } from "../contexts/ThemeContext"

export type SortOption = "name" | "date" | "size" | "type"
export type SortDirection = "asc" | "desc"

interface SortButtonProps {
  currentSort: SortOption
  currentDirection: SortDirection
  onSortChange: (option: SortOption, direction: SortDirection) => void
}

const SortButton: React.FC<SortButtonProps> = ({ currentSort, currentDirection, onSortChange }) => {
  const { isDark } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "name":
        return "Name"
      case "date":
        return "Date Modified"
      case "size":
        return "Size"
      case "type":
        return "File Type"
    }
  }

  const handleSortSelect = (option: SortOption) => {
    // If selecting the same option, toggle direction
    const newDirection = option === currentSort && currentDirection === "asc" ? "desc" : "asc"

    onSortChange(option, newDirection)
    setModalVisible(false)
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? "#333333" : "#f0f0f0" }]}
        onPress={() => setModalVisible(true)}
      >
        <Icon
          name={currentDirection === "asc" ? "arrow-up" : "arrow-down"}
          size={14}
          color={isDark ? "#ffffff" : "#000000"}
          style={styles.icon}
        />
        <Text style={[styles.buttonText, { color: isDark ? "#ffffff" : "#000000" }]}>{getSortLabel(currentSort)}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? "#1f1f1f" : "#ffffff" }]}>
            <Text style={[styles.modalTitle, { color: isDark ? "#ffffff" : "#000000" }]}>Sort By</Text>

            {(["name", "date", "size", "type"] as SortOption[]).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sortOption,
                  currentSort === option && {
                    backgroundColor: isDark ? "#333333" : "#f0f0f0",
                  },
                ]}
                onPress={() => handleSortSelect(option)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    { color: isDark ? "#ffffff" : "#000000" },
                    currentSort === option && { fontWeight: "bold" },
                  ]}
                >
                  {getSortLabel(option)}
                </Text>

                {currentSort === option && (
                  <Icon
                    name={currentDirection === "asc" ? "arrow-up" : "arrow-down"}
                    size={16}
                    color={isDark ? "#ffffff" : "#000000"}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  icon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionText: {
    fontSize: 16,
  },
})

export default SortButton

