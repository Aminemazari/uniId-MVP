"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS } from "../constants/theme"
import CredentialCard from "../components/CredentialCard"
import { mockCredentials } from "../data/mockData"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const CredentialsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredCredentials = mockCredentials.filter((cred) => {
    const matchesSearch =
      cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.issuer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || cred.type === selectedType

    return matchesSearch && matchesType
  })

  // Sort credentials based on selected sort option
  const sortedCredentials = [...filteredCredentials].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      case "oldest":
        return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
      case "a-z":
        return a.title.localeCompare(b.title)
      case "z-a":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="search" size={24} color={COLORS.textLight} />
      </View>
      <Text style={styles.emptyStateTitle}>No credentials found</Text>
      <Text style={styles.emptyStateSubtitle}>Try adjusting your search or filters</Text>
      <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
        <Text style={styles.clearButtonText}>Clear Search</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={["right", "left"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Credentials</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="download-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="qr-code-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search credentials..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filtersContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>
              {selectedType === "all" ? "All Types" : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
            </Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>
              {sortBy === "newest"
                ? "Newest First"
                : sortBy === "oldest"
                  ? "Oldest First"
                  : sortBy === "a-z"
                    ? "A-Z"
                    : "Z-A"}
            </Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedCredentials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CredentialCard
            credential={item}
            onPress={() => navigation.navigate("CredentialDetail", { credential: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    ...FONTS.body4,
    color: COLORS.text,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "48%",
  },
  filterButtonText: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 16,
    textAlign: "center",
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  clearButtonText: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
})

export default CredentialsScreen
