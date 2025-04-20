"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import * as LocalAuthentication from "expo-local-authentication"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS, FONTS } from "../constants/theme"
import Button from "../components/Button"
import type { RootStackParamList } from "../App"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isBiometricSupported, setIsBiometricSupported] = useState(false)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    ;(async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      setIsBiometricSupported(compatible)
    })()
  }, [])

  const handleBiometricAuth = async () => {
    try {
      setIsLoading(true)

      // Check if hardware supports biometrics
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync()

      if (!isBiometricAvailable) {
        Alert.alert("Biometric authentication not supported")
        setIsLoading(false)
        return
      }

      // Check if saved biometrics exist
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync()
      if (!savedBiometrics) {
        Alert.alert("Biometric authentication not set up on this device")
        setIsLoading(false)
        return
      }

      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with Biometrics",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      })

      if (result.success) {
        // Simulate loading
        setTimeout(() => {
          setIsLoading(false)
          navigation.replace("MainTabs")
        }, 1000)
      } else {
        setIsLoading(false)
        Alert.alert("Authentication failed", "Please try again")
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      Alert.alert("An error occurred", "Please try again later")
    }
  }

  const handlePasswordLogin = () => {
    // For demo purposes, we'll just navigate to the main app
    navigation.replace("MainTabs")
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>U</Text>
            </View>
            <Text style={styles.logoTitle}>UniID</Text>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Access your digital identity and credentials</Text>
        </View>

        <View style={styles.authSection}>
          {isBiometricSupported && (
            <Button
              title="Login with Biometrics"
              onPress={handleBiometricAuth}
              loading={isLoading}
              icon={<Ionicons name="finger-print" size={20} color={COLORS.white} />}
              style={styles.biometricButton}
            />
          )}

          <Button
            title="Login with Password"
            variant="outline"
            onPress={handlePasswordLogin}
            icon={<Ionicons name="key-outline" size={20} color={COLORS.text} />}
            style={styles.passwordButton}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: "bold",
  },
  logoTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: "bold",
  },
  welcomeSection: {
    marginBottom: 40,
  },
  welcomeTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  authSection: {
    marginBottom: 40,
  },
  biometricButton: {
    marginBottom: 16,
  },
  passwordButton: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: "center",
  },
  forgotPasswordText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginRight: 4,
  },
  signupText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: "bold",
  },
})

export default LoginScreen
