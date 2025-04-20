import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS } from "../constants/theme"

interface CredentialCardProps {
  credential: {
    id: string
    title: string
    issuer: string
    icon: string
    color: string
    textColor: string
  }
  onPress: () => void
}

const CredentialCard = ({ credential, onPress }: CredentialCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: credential.color }]}>
          <Ionicons name={credential.icon} size={20} color={credential.textColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{credential.title}</Text>
          <View style={styles.issuerRow}>
            <Text style={styles.issuer}>Issued by {credential.issuer}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Valid</Text>
            </View>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 4,
  },
  issuerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  issuer: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    ...FONTS.body5,
    color: "#15803d",
    fontWeight: "500",
  },
})

export default CredentialCard
