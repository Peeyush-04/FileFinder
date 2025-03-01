"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Switch, TextInput } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useTheme } from "../contexts/ThemeContext"

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: {
    fileType?: string
    minSize?: number
    maxSize?: number
    minDate?: number
    maxDate?: number
  }) => void
  initialFilters?: {
    fileType?: string
    minSize?: number
    maxSize?: number
    minDate?: number
    maxDate?: number
  }
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, initialFilters = {} }) => {
  const { isDark } = useTheme()

  const [fileType, setFileType] = useState(initialFilters.fileType || "")
  const [useSize, setUseSize] = useState(initialFilters.minSize !== undefined || initialFilters.maxSize !== undefined)
  const [minSize, setMinSize] = useState(initialFilters.minSize !== undefined ? String(initialFilters.minSize) : "")
  const [maxSize, setMaxSize] = useState(initialFilters.maxSize !== undefined ? String(initialFilters.maxSize) : "")

  const [useDate, setUseDate] = useState(initialFilters.minDate !== undefined || initialFilters.maxDate !== undefined)
  const [minDate, setMinDate] = useState(
    initialFilters.minDate !== undefined ? new Date(initialFilters.minDate * 1000) : new Date(),
  )
  const [maxDate, setMaxDate] = useState(
    initialFilters.maxDate !== undefined ? new Date(initialFilters.maxDate * 1000) : new Date(),
  )

  // Reset filters when modal is opened
  useEffect(() => {
    if (visible) {
      setFileType(initialFilters.fileType || "")
      setUseSize(initialFilters.minSize !== undefined || initialFilters.maxSize !== undefined)
      setMinSize(initialFilters.minSize !== undefined ? String(initialFilters.minSize) : "")
      setMaxSize(initialFilters.maxSize !== undefined ? String(initialFilters.maxSize) : "")
      setUseDate(initialFilters.minDate !== undefined || initialFilters.maxDate !== undefined)
      setMinDate(initialFilters.minDate !== undefined ? new Date(initialFilters.minDate * 1000) : new Date())
      setMaxDate(initialFilters.maxDate !== undefined ? new Date(initialFilters.maxDate * 1000) : new Date())
    }
  }, [visible, initialFilters])

  const handleApply = () => {
    const filters: {
      fileType?: string
      minSize?: number
      maxSize?: number
      minDate?: number
      maxDate?: number
    } = {}

    if (fileType) {
      filters.fileType = fileType
    }

    if (useSize) {
      if (minSize) {
        filters.minSize = Number.parseInt(minSize, 10)
      }
      if (maxSize) {
        filters.maxSize = Number.parseInt(maxSize, 10)
      }
    }

    if (useDate) {
      filters.minDate = Math.floor(minDate.getTime() / 1000)
      filters.maxDate = Math.floor(maxDate.getTime() / 1000)
    }

    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFileType("")
    setUseSize(false)
    setMinSize("")
    setMaxSize("")
    setUseDate(false)
    setMinDate(new Date())
    setMaxDate(new Date())
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.3)" }]}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? "#1f1f1f" : "#ffffff" }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDark ? "#ffffff" : "#000000" }]}>Filter Files</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color={isDark ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* File Type Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: isDark ? "#ffffff" : "#000000" }]}>File Type</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDark ? "#ffffff" : "#000000",
                    borderColor: isDark ? "#333333" : "#e0e0e0",
                  },
                ]}
                placeholder="e.g., pdf, jpg, doc"
                placeholderTextColor={isDark ? "#b0b0b0" : "#999999"}
                value={fileType}
                onChangeText={setFileType}
              />
            </View>

            {/* File Size Filter */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <Text style={[styles.filterTitle, { color: isDark ? "#ffffff" : "#000000" }]}>File Size</Text>
                <Switch
                  value={useSize}
                  onValueChange={setUseSize}
                  trackColor={{ false: "#767577", true: "#4A90E2" }}
                  thumbColor={useSize ? "#f4f3f4" : "#f4f3f4"}
                />
              </View>

              {useSize && (
                <View style={styles.sizeInputs}>
                  <View style={styles.sizeInputContainer}>
                    <Text style={[styles.sizeLabel, { color: isDark ? "#b0b0b0" : "#666666" }]}>Min (bytes)</Text>
                    <TextInput
                      style={[
                        styles.sizeInput,
                        {
                          color: isDark ? "#ffffff" : "#000000",
                          borderColor: isDark ? "#333333" : "#e0e0e0",
                        },
                      ]}
                      placeholder="0"
                      placeholderTextColor={isDark ? "#b0b0b0" : "#999999"}
                      value={minSize}
                      onChangeText={setMinSize}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.sizeInputContainer}>
                    <Text style={[styles.sizeLabel, { color: isDark ? "#b0b0b0" : "#666666" }]}>Max (bytes)</Text>
                    <TextInput
                      style={[
                        styles.sizeInput,
                        {
                          color: isDark ? "#ffffff" : "#000000",
                          borderColor: isDark ? "#333333" : "#e0e0e0",
                        },
                      ]}
                      placeholder="Unlimited"
                      placeholderTextColor={isDark ? "#b0b0b0" : "#999999"}
                      value={maxSize}
                      onChangeText={setMaxSize}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Date Filter */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <Text style={[styles.filterTitle, { color: isDark ? "#ffffff" : "#000000" }]}>Date Modified</Text>
                <Switch
                  value={useDate}
                  onValueChange={setUseDate}
                  trackColor={{ false: "#767577", true: "#4A90E2" }}
                  thumbColor={useDate ? "#f4f3f4" : "#f4f3f4"}
                />
              </View>

              {useDate && (
                <View style={styles.dateInputs}>
                  <Text style={[styles.dateLabel, { color: isDark ? "#b0b0b0" : "#666666" }]}>
                    Date range selection would go here
                  </Text>
                  {/* In a real app, you would add date pickers here */}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBody: {
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  sizeInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sizeInputContainer: {
    width: "48%",
  },
  sizeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  sizeInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dateInputs: {
    marginTop: 8,
  },
  dateLabel: {
    fontSize: 14,
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButton: {
    backgroundColor: "transparent",
    width: "30%",
  },
  applyButton: {
    backgroundColor: "#4A90E2",
    width: "65%",
  },
  resetButtonText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  applyButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
})

export default FilterModal

