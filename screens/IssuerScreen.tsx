"use client"

import { useState } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS } from "../constants/theme"
import Button from "../components/Button"
import { mockIssuers } from "../data/mockData"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const IssuerScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIssuer, setSelectedIssuer] = useState(mockIssuers[0])
  const [issuingCredential, setIssuingCredential] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [issuanceSuccess, setIssuanceSuccess] = useState(false)

  const filteredIssuers = mockIssuers.filter((issuer) => issuer.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const credentialTemplates = [
    {
      id: "template-1",
      name: "University Degree",
      type: "education",
      icon: "school",
      fields: ["Degree Name", "Major", "GPA", "Graduation Date", "Student ID"],
    },
    {
      id: "template-2",
      name: "National ID",
      type: "identity",
      icon: "person",
      fields: ["ID Number", "Full Name", "Date of Birth", "Nationality", "Issue Date", "Expiry Date"],
    },
    {
      id: "template-3",
      name: "Professional Certification",
      type: "professional",
      icon: "ribbon",
      fields: ["Certification Name", "Level", "Score", "Issue Date", "Expiry Date", "Certificate Number"],
    },
    {
      id: "template-4",
      name: "Health Record",
      type: "health",
      icon: "heart",
      fields: ["Record Type", "Date", "Provider", "Details", "Reference Number"],
    },
  ]

  const handleIssueCredential = () => {
    setIssuingCredential(true)
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
  }

  const handleSubmitCredential = () => {
    // Simulate credential issuance
    setTimeout(() => {
      setIssuanceSuccess(true)

      // Reset after showing success
      setTimeout(() => {
        setIssuanceSuccess(false)
        setIssuingCredential(false)
        setSelectedTemplate(null)
      }, 3000)
    }, 1500)
  }

  const renderIssuerItem = (issuer) => (
    <TouchableOpacity
      key={issuer.id}
      style={[styles.issuerItem, selectedIssuer.id === issuer.id && styles.selectedIssuerItem]}
      onPress={() => setSelectedIssuer(issuer)}
    >
      <View style={styles.issuerItemContent}>
        <View style={styles.issuerLogo}>
          <Text style={styles.issuerLogoText}>{issuer.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.issuerName}>{issuer.name}</Text>
          <Text style={styles.issuerType}>{issuer.type}</Text>
        </View>
      </View>
      {selectedIssuer.id === issuer.id && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
    </TouchableOpacity>
  )

  const renderCredentialTemplateItem = (template) => (
    <TouchableOpacity key={template.id} style={styles.templateItem} onPress={() => handleTemplateSelect(template)}>
      <View style={styles.templateItemContent}>
        <View style={styles.templateIcon}>
          <Ionicons name={template.icon} size={20} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.templateName}>{template.name}</Text>
          <Text style={styles.templateType}>{template.type}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issuer Dashboard</Text>
        <Button
          title="Issue"
          icon={<Ionicons name="add" size={16} color={COLORS.white} />}
          onPress={handleIssueCredential}
          style={styles.issueButton}
          textStyle={styles.issueButtonText}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Issuers</Text>
            <Text style={styles.sidebarSubtitle}>Select an organization to issue credentials</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search issuers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.issuersList}>{filteredIssuers.map(renderIssuerItem)}</ScrollView>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.issuerCard}>
            <View style={styles.issuerHeader}>
              <View style={styles.issuerHeaderLogo}>
                <Text style={styles.issuerHeaderLogoText}>{selectedIssuer.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.issuerHeaderName}>{selectedIssuer.name}</Text>
                <Text style={styles.issuerHeaderDescription}>{selectedIssuer.description}</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Credentials Issued</Text>
                <Text style={styles.statValue}>{selectedIssuer.credentialsIssued.toLocaleString()}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Status</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </View>

            <Button
              title="Issue New Credential"
              icon={<Ionicons name="add" size={16} color={COLORS.white} />}
              onPress={handleIssueCredential}
              style={styles.fullWidthButton}
            />
          </View>

          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            <Text style={styles.activitySubtitle}>Latest credentials issued by this organization</Text>

            <View style={styles.activityList}>
              <ActivityItem
                icon="school"
                color="#dbeafe"
                textColor="#1e40af"
                title="Bachelor of Computer Science"
                recipient="Alex Lee"
                days={2}
              />
              <ActivityItem
                icon="ribbon"
                color="#dcfce7"
                textColor="#15803d"
                title="Web Development Certification"
                recipient="Jamie Smith"
                days={3}
              />
              <ActivityItem
                icon="school"
                color="#dbeafe"
                textColor="#1e40af"
                title="Master of Data Science"
                recipient="Taylor Johnson"
                days={5}
              />
            </View>

            <Button title="View All Activity" variant="outline" onPress={() => {}} style={styles.viewAllButton} />
          </View>
        </View>
      </View>

      {/* Issue Credential Modal */}
      {issuingCredential && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Issue New Credential</Text>
              <Text style={styles.modalSubtitle}>Create and issue a verifiable credential to a recipient</Text>
            </View>

            {!selectedTemplate && !issuanceSuccess && (
              <View style={styles.modalContent}>
                <Text style={styles.modalSectionTitle}>Select a Credential Template</Text>
                <View style={styles.templatesList}>{credentialTemplates.map(renderCredentialTemplateItem)}</View>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setIssuingCredential(false)}
                  style={styles.fullWidthButton}
                />
              </View>
            )}

            {selectedTemplate && !issuanceSuccess && (
              <View style={styles.modalContent}>
                <View style={styles.templateHeader}>
                  <View style={styles.templateHeaderIcon}>
                    <Ionicons name={selectedTemplate.icon} size={20} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.templateHeaderName}>{selectedTemplate.name}</Text>
                    <Text style={styles.templateHeaderIssuer}>Issued by: {selectedIssuer.name}</Text>
                  </View>
                </View>

                <ScrollView style={styles.formContainer}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Recipient DID</Text>
                    <TextInput style={styles.formInput} placeholder="did:uniid:..." />
                    <Text style={styles.formHelper}>Enter the Decentralized Identifier of the recipient</Text>
                  </View>

                  {selectedTemplate.fields.map((field, index) => (
                    <View key={index} style={styles.formField}>
                      <Text style={styles.formLabel}>{field}</Text>
                      <TextInput style={styles.formInput} placeholder={`Enter ${field.toLowerCase()}`} />
                    </View>
                  ))}

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Expiry Date</Text>
                    <TextInput style={styles.formInput} placeholder="MM/DD/YYYY" />
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Additional Notes</Text>
                    <TextInput
                      style={[styles.formInput, styles.textArea]}
                      placeholder="Add any additional information..."
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <Button
                    title="Back"
                    variant="outline"
                    onPress={() => setSelectedTemplate(null)}
                    style={styles.modalActionButton}
                  />
                  <Button title="Issue Credential" onPress={handleSubmitCredential} style={styles.modalActionButton} />
                </View>
              </View>
            )}

            {issuanceSuccess && (
              <View style={styles.successContent}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark" size={32} color={COLORS.success} />
                </View>
                <Text style={styles.successTitle}>Credential Issued</Text>
                <Text style={styles.successMessage}>The credential has been successfully issued to the recipient</Text>
                <Button
                  title="Done"
                  onPress={() => {
                    setIssuanceSuccess(false)
                    setIssuingCredential(false)
                    setSelectedTemplate(null)
                  }}
                  style={styles.fullWidthButton}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

const ActivityItem = ({ icon, color, textColor, title, recipient, days }) => (
  <View style={styles.activityItem}>
    <View style={styles.activityItemContent}>
      <View style={[styles.activityIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={16} color={textColor} />
      </View>
      <View>
        <Text style={styles.activityItemTitle}>{title}</Text>
        <Text style={styles.activityItemSubtitle}>
          Issued to: {recipient} • {days} days ago
        </Text>
      </View>
    </View>
    <TouchableOpacity style={styles.activityItemAction}>
      <Ionicons name="document-text-outline" size={16} color={COLORS.text} />
    </TouchableOpacity>
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
  issueButton: {
    height: 36,
    paddingHorizontal: 12,
  },
  issueButtonText: {
    ...FONTS.body4,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: "35%",
    backgroundColor: COLORS.white,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sidebarTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 4,
  },
  sidebarSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
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
  issuersList: {
    flex: 1,
    padding: 16,
  },
  issuerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedIssuerItem: {
    backgroundColor: COLORS.primary + "10",
    borderColor: COLORS.primary + "30",
  },
  issuerItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  issuerLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  issuerLogoText: {
    ...FONTS.body4,
    fontWeight: "bold",
    color: COLORS.text,
  },
  issuerName: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  issuerType: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textTransform: "capitalize",
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  issuerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  issuerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  issuerHeaderLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  issuerHeaderLogoText: {
    ...FONTS.h3,
    fontWeight: "bold",
    color: COLORS.text,
  },
  issuerHeaderName: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  issuerHeaderDescription: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  statLabel: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statValue: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 8,
  },
  statusText: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: "500",
  },
  fullWidthButton: {
    width: "100%",
  },
  activityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  activitySubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  activityList: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityItemTitle: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  activityItemSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  activityItemAction: {
    padding: 8,
  },
  viewAllButton: {
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "80%",
    maxHeight: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  modalContent: {
    padding: 16,
  },
  modalSectionTitle: {
    ...FONTS.body4,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 12,
  },
  templatesList: {
    marginBottom: 16,
  },
  templateItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  templateItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  templateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  templateName: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  templateType: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textTransform: "capitalize",
  },
  templateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  templateHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  templateHeaderName: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  templateHeaderIssuer: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  formContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    ...FONTS.body4,
    color: COLORS.text,
    marginBottom: 8,
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    ...FONTS.body4,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  formHelper: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
  },
  modalActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  successContent: {
    padding: 24,
    alignItems: "center",
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
    ...FONTS.h2,
    color: COLORS.success,
    marginBottom: 8,
  },
  successMessage: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
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

export default IssuerScreen
