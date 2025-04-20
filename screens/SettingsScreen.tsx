"use client"

import { useState } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS } from "../constants/theme"
import Button from "../components/Button"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const SettingsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("account")
  const [darkMode, setDarkMode] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [backupEnabled, setBackupEnabled] = useState(false)
  const [language, setLanguage] = useState("english")
  const insets = useSafeAreaInsets()

  const renderTabButton = (tabName, label) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTabButton]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabButtonText, activeTab === tabName && styles.activeTabButtonText]}>{label}</Text>
    </TouchableOpacity>
  )

  const renderAccountTab = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile Information</Text>
        <Text style={styles.cardDescription}>Manage your account details</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AL</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>Profile Photo</Text>
            <Text style={styles.profileDescription}>This photo will be used for your digital identity</Text>
            <View style={styles.profileActions}>
              <Button
                title="Change Photo"
                variant="outline"
                style={styles.smallButton}
                textStyle={styles.smallButtonText}
                onPress={() => {}}
              />
              <Button
                title="Remove"
                variant="outline"
                style={[styles.smallButton, styles.removeButton]}
                textStyle={[styles.smallButtonText, styles.removeButtonText]}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formField}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} defaultValue="Alex" />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} defaultValue="Lee" />
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} defaultValue="alex.lee@example.com" keyboardType="email-address" />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Decentralized Identifier (DID)</Text>
          <View style={styles.didContainer}>
            <TextInput style={[styles.input, styles.didInput]} defaultValue="did:uniid:1234...5678" editable={false} />
            <Button title="Copy" variant="outline" style={styles.copyButton} onPress={() => {}} />
          </View>
          <Text style={styles.helperText}>Your unique identifier on the UniID network</Text>
        </View>
      </View>

      <View style={[styles.card, styles.dangerCard]}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <Text style={styles.dangerDescription}>Irreversible account actions</Text>

        <View style={styles.dangerAction}>
          <View style={styles.dangerInfo}>
            <Text style={styles.dangerActionTitle}>Delete Account</Text>
            <Text style={styles.dangerActionDescription}>
              Permanently delete your account and all associated credentials. This action cannot be undone.
            </Text>
          </View>
          <Button
            title="Delete Account"
            variant="outline"
            style={styles.dangerButton}
            textStyle={styles.dangerButtonText}
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  )

  const renderSecurityTab = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Authentication</Text>
        <Text style={styles.cardDescription}>Manage your security settings</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="phone-portrait-outline" size={16} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
            </View>
            <Text style={styles.settingDescription}>Use fingerprint or face recognition to unlock your wallet</Text>
          </View>
          <Switch
            value={biometricAuth}
            onValueChange={setBiometricAuth}
            trackColor={{ false: COLORS.border, true: COLORS.primary + "80" }}
            thumbColor={biometricAuth ? COLORS.primary : COLORS.white}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.recoverySection}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="key-outline" size={16} color={COLORS.primary} />
            <Text style={styles.settingLabel}>Recovery Phrase</Text>
          </View>
          <Text style={styles.settingDescription}>
            Your recovery phrase is the only way to restore your wallet if you lose access to your device. Keep it in a
            safe place and never share it with anyone.
          </Text>
          <View style={styles.recoveryActions}>
            <Button title="View Recovery Phrase" variant="outline" onPress={() => {}} style={styles.recoveryButton} />
            <Button title="Back Up Now" onPress={() => {}} style={styles.recoveryButton} />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Device Management</Text>
        <Text style={styles.cardDescription}>Manage devices that have access to your wallet</Text>

        <View style={styles.deviceItem}>
          <View style={styles.deviceInfo}>
            <View style={styles.deviceIcon}>
              <Ionicons name="phone-portrait-outline" size={16} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.deviceName}>Current Device</Text>
              <Text style={styles.deviceLastActive}>Last active: Just now</Text>
            </View>
          </View>
          <View style={styles.deviceBadge}>
            <Text style={styles.deviceBadgeText}>Active</Text>
          </View>
        </View>

        <Button
          title="Sign Out From All Devices"
          variant="outline"
          icon={<Ionicons name="log-out-outline" size={16} color={COLORS.text} />}
          onPress={() => {}}
          style={styles.fullWidthButton}
        />
      </View>
    </View>
  )

  const renderPrivacyTab = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy Settings</Text>
        <Text style={styles.cardDescription}>Control how your data is used and shared</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="shield-outline" size={16} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Zero-Knowledge Proofs</Text>
            </View>
            <Text style={styles.settingDescription}>
              Use privacy-preserving proofs when sharing credentials (e.g., prove you're over 18 without revealing your
              birthdate)
            </Text>
          </View>
          <Switch
            value={true}
            trackColor={{ false: COLORS.border, true: COLORS.primary + "80" }}
            thumbColor={true ? COLORS.primary : COLORS.white}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={16} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Credential Usage Notifications</Text>
            </View>
            <Text style={styles.settingDescription}>
              Receive notifications when your credentials are used or verified
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: COLORS.border, true: COLORS.primary + "80" }}
            thumbColor={notifications ? COLORS.primary : COLORS.white}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="cloud-upload-outline" size={16} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Encrypted Backup</Text>
            </View>
            <Text style={styles.settingDescription}>
              Securely back up your credentials to the cloud with end-to-end encryption
            </Text>
          </View>
          <Switch
            value={backupEnabled}
            onValueChange={setBackupEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary + "80" }}
            thumbColor={backupEnabled ? COLORS.primary : COLORS.white}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Management</Text>
        <Text style={styles.cardDescription}>Export or delete your data</Text>

        <Button
          title="Export All Data"
          variant="outline"
          icon={<Ionicons name="download-outline" size={16} color={COLORS.text} />}
          onPress={() => {}}
          style={styles.fullWidthButton}
        />

        <Text style={styles.dataNote}>
          Your data is stored locally on your device. UniID does not have access to your personal information.
        </Text>
      </View>
    </View>
  )

  const renderPreferencesTab = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Appearance</Text>
        <Text style={styles.cardDescription}>Customize how UniID looks</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={styles.settingLabelContainer}>
              {darkMode ? (
                <Ionicons name="moon-outline" size={16} color={COLORS.primary} />
              ) : (
                <Ionicons name="sunny-outline" size={16} color={COLORS.primary} />
              )}
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Text style={styles.settingDescription}>Switch between light and dark themes</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: COLORS.border, true: COLORS.primary + "80" }}
            thumbColor={darkMode ? COLORS.primary : COLORS.white}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Language & Region</Text>
        <Text style={styles.cardDescription}>Set your preferred language and region</Text>

        <View style={styles.languageSection}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="globe-outline" size={16} color={COLORS.primary} />
            <Text style={styles.settingLabel}>Language</Text>
          </View>

          <TouchableOpacity style={styles.languageSelector}>
            <Text style={styles.languageSelectorText}>
              {language === "english"
                ? "English"
                : language === "spanish"
                  ? "Spanish"
                  : language === "french"
                    ? "French"
                    : language === "german"
                      ? "German"
                      : language === "chinese"
                        ? "Chinese"
                        : "Arabic"}
            </Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderActiveTab = () => {
    switch (activeTab) {
      case "account":
        return renderAccountTab()
      case "security":
        return renderSecurityTab()
      case "privacy":
        return renderPrivacyTab()
      case "preferences":
        return renderPreferencesTab()
      default:
        return renderAccountTab()
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {renderTabButton("account", "Account")}
        {renderTabButton("security", "Security")}
        {renderTabButton("privacy", "Privacy")}
        {renderTabButton("preferences", "Preferences")}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveTab()}
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
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileLabel: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 4,
  },
  profileDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  profileActions: {
    flexDirection: "row",
  },
  smallButton: {
    height: 32,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  smallButtonText: {
    ...FONTS.body5,
  },
  removeButton: {
    borderColor: "transparent",
  },
  removeButtonText: {
    color: COLORS.error,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  formField: {
    flex: 1,
    marginBottom: 16,
    marginRight: 8,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    ...FONTS.body4,
    color: COLORS.text,
  },
  didContainer: {
    flexDirection: "row",
  },
  didInput: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  copyButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
  },
  helperText: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: 4,
  },
  dangerCard: {
    borderColor: COLORS.error + "30",
  },
  dangerTitle: {
    ...FONTS.h3,
    color: COLORS.error,
    marginBottom: 4,
  },
  dangerDescription: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  dangerAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "10",
    borderWidth: 1,
    borderColor: COLORS.error + "30",
    borderRadius: 8,
    padding: 16,
  },
  dangerInfo: {
    flex: 1,
    marginRight: 16,
  },
  dangerActionTitle: {
    ...FONTS.h4,
    color: COLORS.error,
    marginBottom: 4,
  },
  dangerActionDescription: {
    ...FONTS.body5,
    color: COLORS.error + "CC",
  },
  dangerButton: {
    borderColor: COLORS.error + "50",
  },
  dangerButtonText: {
    color: COLORS.error,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  settingLabel: {
    ...FONTS.body4,
    color: COLORS.text,
    marginLeft: 8,
  },
  settingDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  recoverySection: {
    marginBottom: 16,
  },
  recoveryActions: {
    flexDirection: "row",
    marginTop: 16,
  },
  recoveryButton: {
    flex: 1,
    marginRight: 8,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    marginBottom: 16,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deviceName: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  deviceLastActive: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  deviceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.success + "20",
    borderRadius: 12,
  },
  deviceBadgeText: {
    ...FONTS.body5,
    color: COLORS.success,
  },
  fullWidthButton: {
    width: "100%",
  },
  dataNote: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 16,
  },
  languageSection: {
    marginBottom: 16,
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  languageSelectorText: {
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

export default SettingsScreen
