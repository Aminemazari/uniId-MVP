import { StyleSheet, View, Text } from "react-native"
import { StatusBar } from "expo-status-bar"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS, FONTS } from "../constants/theme"
import Button from "../components/Button"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList } from "../App"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Welcome">
}

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="finger-print" size={80} color={COLORS.white} />
          </View>
          <Text style={styles.title}>
            Your Identity, <Text style={styles.highlight}>Your Control</Text>
          </Text>
          <Text style={styles.subtitle}>
            UniID is a decentralized identity and credential wallet that works across both physical and virtual worlds.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Access Your Wallet"
            onPress={() => navigation.navigate("Login")}
            style={styles.primaryButton}
          />
          <Button title="Learn More" variant="outline" onPress={() => {}} style={styles.secondaryButton} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 16,
  },
  highlight: {
    color: "#c4b5fd",
  },
  subtitle: {
    ...FONTS.body3,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    maxWidth: "90%",
  },
  buttonContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  secondaryButton: {
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
})

export default WelcomeScreen
