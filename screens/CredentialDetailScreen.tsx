import { StyleSheet, View, Text, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS } from "../constants/theme"
import Button from "../components/Button"

const CredentialDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const { credential } = route.params

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content}>
        <View style={styles.credentialHeader}>
          <View style={[styles.iconContainer, { backgroundColor: credential.color }]}>
            <Ionicons name={credential.icon} size={24} color={credential.textColor} />
          </View>
          <View>
            <Text style={styles.credentialTitle}>{credential.title}</Text>
            <Text style={styles.credentialIssuer}>Issued by {credential.issuer}</Text>
          </View>
        </View>

        <Text style={styles.description}>{credential.description}</Text>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Credential Details</Text>
          <View style={styles.detailsContainer}>
            <DetailRow label="Type" value={credential.type.charAt(0).toUpperCase() + credential.type.slice(1)} />
            <DetailRow label="Issue Date" value={formatDate(credential.issueDate)} />
            <DetailRow label="Expiry Date" value={formatDate(credential.expiryDate)} />
            <DetailRow label="Status" value="Valid" valueStyle={{ color: COLORS.success }} />
            <DetailRow label="Credential ID" value={`vc:uniid:${credential.id}`} />
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Credential Metadata</Text>
          <View style={styles.detailsContainer}>
            {Object.entries(credential.metadata).map(([key, value]) => (
              <DetailRow key={key} label={key} value={value} />
            ))}
          </View>
        </View>

        <View style={styles.qrContainer}>
          <Ionicons name="qr-code" size={128} color={COLORS.text} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Download"
          variant="outline"
          icon={<Ionicons name="download-outline" size={20} color={COLORS.text} />}
          onPress={() => {}}
          style={styles.footerButton}
        />
        <Button
          title="Share"
          icon={<Ionicons name="share-outline" size={20} color={COLORS.white} />}
          onPress={() => {}}
          style={styles.footerButton}
        />
      </View>
    </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  credentialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  credentialTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  credentialIssuer: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  detailValue: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: "500",
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
})

export default CredentialDetailScreen
