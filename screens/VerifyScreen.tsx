"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS } from "../constants/theme"
import Button from "../components/Button"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const VerifyScreen = ({ navigation }) => {
  const [verificationState, setVerificationState] = useState("idle") // idle, scanning, success, failed
  const [verifiedCredential, setVerifiedCredential] = useState(null)
  const [activeTab, setActiveTab] = useState("scan")
  const insets = useSafeAreaInsets()

  const handleStartScan = () => {
    setVerificationState("scanning")

    // Simulate scanning process
    setTimeout(() => {
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.3

      if (success) {
        setVerificationState("success")
        setVerifiedCredential({
          type: "education",
          title: "Bachelor of Computer Science",
          issuer: "University of Technology",
          issuedTo: "Alex Lee",
          issueDate: "2022-05-15",
          expiryDate: "2032-05-15",
          status: "Valid",
        })
      } else {
        setVerificationState("failed")
      }
    }, 2000)
  }

  const handleReset = () => {
    setVerificationState("idle")
    setVerifiedCredential(null)
  }

  const renderScanContent = () => {
    switch (verificationState) {
      case "idle":
        return (
          <View style={styles.scanContent}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={96} color={COLORS.textLight} />
            </View>
            <Text style={styles.scanInstructions}>Position the QR code in the center of the camera view</Text>
            <Button title="Start Camera" onPress={handleStartScan} style={styles.fullWidthButton} />
          </View>
        )

      case "scanning":
        return (
          <View style={styles.scanContent}>
            <View style={styles.qrScanning}>
              <View style={styles.scanLine} />
              <Ionicons name="qr-code" size={96} color={COLORS.text} />
            </View>
            <View style={styles.scanningStatus}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.scanningText}>Scanning...</Text>
            </View>
            <Button title="Cancel" variant="outline" onPress={handleReset} style={styles.fullWidthButton} />
          </View>
        )

      case "success":
        return (
          <View style={styles.scanContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={48} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>Verification Successful</Text>
            <Text style={styles.successSubtitle}>The credential has been verified successfully</Text>

            {verifiedCredential && (
              <View style={styles.verifiedCredential}>
                <Text style={styles.verifiedTitle}>{verifiedCredential.title}</Text>
                <View style={styles.verifiedDetails}>
                  <DetailRow label="Issued to" value={verifiedCredential.issuedTo} />
                  <DetailRow label="Issuer" value={verifiedCredential.issuer} />
                  <DetailRow label="Issue Date" value={new Date(verifiedCredential.issueDate).toLocaleDateString()} />
                  <DetailRow label="Expiry Date" value={new Date(verifiedCredential.expiryDate).toLocaleDateString()} />
                  <DetailRow label="Status" value={verifiedCredential.status} valueStyle={{ color: COLORS.success }} />
                </View>
              </View>
            )}

            <Button title="Verify Another" onPress={handleReset} style={styles.fullWidthButton} />
          </View>
        )

      case "failed":
        return (
          <View style={styles.scanContent}>
            <View style={styles.failedIcon}>
              <Ionicons name="close" size={48} color={COLORS.error} />
            </View>
            <Text style={styles.failedTitle}>Verification Failed</Text>
            <Text style={styles.failedSubtitle}>Unable to verify the credential. Please try again.</Text>
            <Button title="Try Again" onPress={handleReset} style={styles.fullWidthButton} />
          </View>
        )

      default:
        return null
    }
  }

  const renderUploadContent = () => (
    <View style={styles.uploadContent}>
      <View style={styles.uploadArea}>
        <View style={styles.uploadIcon}>
          <Ionicons name="qr-code" size={32} color={COLORS.textLight} />
        </View>
        <Text style={styles.uploadText}>Drag and drop a QR code image here</Text>
        <Text style={styles.uploadSubtext}>or click to browse files</Text>
        <Button title="Browse Files" variant="outline" onPress={() => {}} style={styles.browseButton} />
      </View>
      <Button title="Verify" disabled={true} style={styles.fullWidthButton} />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Credentials</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verify Credentials</Text>
          <Text style={styles.cardDescription}>Scan a QR code to verify a UniID credential</Text>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "scan" && styles.activeTabButton]}
              onPress={() => setActiveTab("scan")}
            >
              <Text style={[styles.tabButtonText, activeTab === "scan" && styles.activeTabButtonText]}>Scan QR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "upload" && styles.activeTabButton]}
              onPress={() => setActiveTab("upload")}
            >
              <Text style={[styles.tabButtonText, activeTab === "upload" && styles.activeTabButtonText]}>Upload</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>{activeTab === "scan" ? renderScanContent() : renderUploadContent()}</View>

          <Text style={styles.footerText}>
            UniID uses cryptographic verification to ensure the authenticity of credentials.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const DetailRow = ({ label, value, valueStyle = {} }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
  </View>
)

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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
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
  tabs: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
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
  tabContent: {
    marginBottom: 16,
  },
  scanContent: {
    alignItems: "center",
  },
  qrPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  qrScanning: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  scanLine: {
    position: "absolute",
    height: 2,
    width: "100%",
    backgroundColor: COLORS.primary + "50",
    top: "50%",
  },
  scanInstructions: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 16,
  },
  scanningStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  scanningText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginLeft: 8,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    ...FONTS.h3,
    color: COLORS.success,
    marginBottom: 8,
  },
  successSubtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 16,
  },
  failedIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.error + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  failedTitle: {
    ...FONTS.h3,
    color: COLORS.error,
    marginBottom: 8,
  },
  failedSubtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 16,
  },
  verifiedCredential: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  verifiedTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 12,
  },
  verifiedDetails: {},
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  detailLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  detailValue: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  uploadContent: {
    alignItems: "center",
  },
  uploadArea: {
    width: "100%",
    aspectRatio: 1.5,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  uploadSubtext: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  browseButton: {
    paddingHorizontal: 16,
    height: 36,
  },
  fullWidthButton: {
    width: "100%",
  },
  footerText: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textAlign: "center",
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

export default VerifyScreen
