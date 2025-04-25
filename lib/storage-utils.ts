// Enhanced storage utilities for UniID 2.0

import { encryptData, decryptData } from "./crypto-utils"
import type { User, VerifiableCredential, ActivityLogEntry, BackupData } from "./types"

// Store user data securely
export function storeUserData(userData: User, encryptionKey: string): void {
  try {
    const encrypted = encryptData(userData, encryptionKey)
    localStorage.setItem("uniid_user", encrypted)
  } catch (error) {
    console.error("Error storing user data:", error)
  }
}

// Retrieve user data
export function getUserData(encryptionKey: string): User | null {
  try {
    const encrypted = localStorage.getItem("uniid_user")
    if (!encrypted) return null

    return decryptData(encrypted, encryptionKey)
  } catch (error) {
    console.error("Error retrieving user data:", error)
    return null
  }
}

// Store credentials securely
export function storeCredentials(credentials: VerifiableCredential[], encryptionKey: string): void {
  try {
    const encrypted = encryptData(credentials, encryptionKey)
    localStorage.setItem("uniid_credentials", encrypted)
  } catch (error) {
    console.error("Error storing credentials:", error)
  }
}

// Retrieve credentials
export function getCredentials(encryptionKey: string): VerifiableCredential[] | null {
  try {
    const encrypted = localStorage.getItem("uniid_credentials")
    if (!encrypted) return null

    return decryptData(encrypted, encryptionKey)
  } catch (error) {
    console.error("Error retrieving credentials:", error)
    return null
  }
}

// Store activity log
export function storeActivityLog(activities: ActivityLogEntry[], encryptionKey: string): void {
  try {
    const encrypted = encryptData(activities, encryptionKey)
    localStorage.setItem("uniid_activities", encrypted)
  } catch (error) {
    console.error("Error storing activity log:", error)
  }
}

// Retrieve activity log
export function getActivityLog(encryptionKey: string): ActivityLogEntry[] | null {
  try {
    const encrypted = localStorage.getItem("uniid_activities")
    if (!encrypted) return null

    return decryptData(encrypted, encryptionKey)
  } catch (error) {
    console.error("Error retrieving activity log:", error)
    return null
  }
}

// Clear all stored data (for logout)
export function clearAllData(): void {
  localStorage.removeItem("uniid_user")
  localStorage.removeItem("uniid_credentials")
  localStorage.removeItem("uniid_activities")
  localStorage.removeItem("uniid_biometric")
  localStorage.removeItem("uniid_backup")
}

// Store biometric data (improved security)
export function storeBiometricData(biometricId: string, encryptionKey: string): void {
  try {
    const encrypted = encryptData({ biometricId, timestamp: new Date().toISOString() }, encryptionKey)
    localStorage.setItem("uniid_biometric", encrypted)
  } catch (error) {
    console.error("Error storing biometric data:", error)
  }
}

// Verify biometric data
export function verifyBiometricData(biometricId: string, encryptionKey: string): boolean {
  try {
    const encrypted = localStorage.getItem("uniid_biometric")
    if (!encrypted) return false

    const stored = decryptData(encrypted, encryptionKey)
    return stored && stored.biometricId === biometricId
  } catch (error) {
    console.error("Error verifying biometric data:", error)
    return false
  }
}

// Create and store backup
export function createBackup(userData: User, credentials: VerifiableCredential[], encryptionKey: string): BackupData {
  try {
    const backupData = {
      user: userData,
      credentials: credentials,
      timestamp: new Date().toISOString(),
    }

    const encrypted = encryptData(backupData, encryptionKey)
    const backup: BackupData = {
      timestamp: new Date().toISOString(),
      encryptedData: encrypted,
      method: "local",
      size: encrypted.length,
    }

    localStorage.setItem("uniid_backup", JSON.stringify(backup))
    return backup
  } catch (error) {
    console.error("Error creating backup:", error)
    throw error
  }
}

// Restore from backup
export function restoreFromBackup(
  backupData: BackupData,
  encryptionKey: string,
): { user: User; credentials: VerifiableCredential[] } | null {
  try {
    const decrypted = decryptData(backupData.encryptedData, encryptionKey)
    if (!decrypted || !decrypted.user || !decrypted.credentials) {
      throw new Error("Invalid backup data")
    }

    // Store the restored data
    storeUserData(decrypted.user, encryptionKey)
    storeCredentials(decrypted.credentials, encryptionKey)

    return {
      user: decrypted.user,
      credentials: decrypted.credentials,
    }
  } catch (error) {
    console.error("Error restoring from backup:", error)
    return null
  }
}
