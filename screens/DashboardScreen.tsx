"use client"

import { useState } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS } from "../constants/theme"
import Button from "../components/Button"
import CredentialCard from "../components/CredentialCard"
import { mockCredentials } from "../data/mockData"

const DashboardScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("all")
  const insets = useSafeAreaInsets()

  const filteredCredentials =
    activeTab === "all" ? mockCredentials : mockCredentials.filter((cred) => cred.type === activeTab)

  const renderTabButton = (tabName, label) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTabButton]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabButtonText, activeTab === tabName && styles.activeTabButtonText]}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Alex</Text>
          <Text style={styles.subtitle}>Manage your digital identity and credentials</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareButton} onPress={() => navigation.navigate("Verify")}>
            <Ionicons name="qr-code-outline" size={16} color={COLORS.text} />
            <Text style={styles.shareButtonText}>Share ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>AL</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabsContainer}>
          {renderTabButton("all", "All")}
          {renderTabButton("education", "Education")}
          {renderTabButton("identity", "Identity")}
          {renderTabButton("professional", "Professional")}
          {renderTabButton("health", "Health")}
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.identityCard}>
            <View style={styles.identityCardHeader}>
              <Text style={styles.identityCardTitle}>Digital Identity</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.identityCardSubtitle}>Your verified digital identity</Text>

            <View style={styles.identityDetails}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>AL</Text>
              </View>
              <View style={styles.identityInfo}>
                <Text style={styles.identityName}>Alex Lee</Text>
                <Text style={styles.identityId}>ID: did:uniid:1234...5678</Text>
                <Text style={styles.identityVerified}>Verified: Yes</Text>
              </View>
            </View>

            <Button
              title="Show QR Code"
              variant="outline"
              icon={<Ionicons name="qr-code-outline" size={16} color={COLORS.text} />}
              onPress={() => {}}
              style={styles.showQrButton}
            />
          </View>

          <View style={styles.addCredentialCard}>
            <Text style={styles.addCredentialTitle}>Add New Credential</Text>
            <Text style={styles.addCredentialSubtitle}>Connect with issuers to add credentials</Text>

            <View style={styles.addCredentialContent}>
              <View style={styles.addIcon}>
                <Ionicons name="add" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.addCredentialText}>
                Scan a QR code or connect with an issuer to add a new credential to your wallet
              </Text>
            </View>

            <Button title="Add Credential" onPress={() => {}} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Credentials</Text>

        <View style={styles.credentialsList}>
          {filteredCredentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              onPress={() => navigation.navigate("CredentialDetail", { credential })}
            />
          ))}
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  shareButtonText: {
    ...FONTS.body4,
    color: COLORS.text,
    marginLeft: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  activeTabButtonText: {
    color: COLORS.white,
  },
  cardsContainer: {
    flexDirection: "column",
    marginBottom: 24,
  },
  identityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  identityCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  identityCardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeText: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  identityCardSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  identityDetails: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarLargeText: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: "bold",
  },
  identityInfo: {
    justifyContent: "center",
  },
  identityName: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 4,
  },
  identityId: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  identityVerified: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  showQrButton: {
    width: "100%",
  },
  addCredentialCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  addCredentialTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  addCredentialSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  addCredentialContent: {
    alignItems: "center",
    marginBottom: 16,
  },
  addIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  addCredentialText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: "center",
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 16,
  },
  credentialsList: {
    marginBottom: 24,
  },
})

export default DashboardScreen
