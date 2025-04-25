// Enhanced cryptographic utilities for UniID 2.0

import { v4 as uuidv4 } from "uuid"
import CryptoJS from "crypto-js"

// Generate a secure random key
export function generateSecureKey(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomValues[i] % chars.length)
  }

  return result
}

// Generate a new DID
export function generateDID(method = "uniid"): string {
  const uuid = uuidv4()
  return `did:${method}:${uuid}`
}

// Generate a short form of DID for display
export function shortenDID(did: string): string {
  const parts = did.split(":")
  if (parts.length !== 3) return did

  const identifier = parts[2]
  if (identifier.length <= 12) return did

  return `${parts[0]}:${parts[1]}:${identifier.substring(0, 6)}...${identifier.substring(identifier.length - 4)}`
}

// Generate a key pair for signing credentials
export function generateKeyPair() {
  // In a real implementation, this would use proper cryptographic libraries
  // For demo purposes, we'll use a more secure approach than before
  const privateKey = CryptoJS.lib.WordArray.random(32).toString()
  const publicKey = CryptoJS.SHA256(privateKey).toString()

  return {
    privateKey,
    publicKey,
  }
}

// Sign data with a private key
export function signData(data: any, privateKey: string): string {
  const dataString = typeof data === "string" ? data : JSON.stringify(data)
  return CryptoJS.HmacSHA256(dataString, privateKey).toString()
}

// Verify a signature with a public key
export function verifySignature(data: any, signature: string, publicKey: string): boolean {
  // In a real implementation, this would use proper cryptographic verification
  // For demo purposes, we'll simulate verification
  const dataString = typeof data === "string" ? data : JSON.stringify(data)
  const expectedSignature = CryptoJS.HmacSHA256(dataString, publicKey).toString()
  return signature === expectedSignature
}

// Encrypt data
export function encryptData(data: any, encryptionKey: string): string {
  const dataString = typeof data === "string" ? data : JSON.stringify(data)
  return CryptoJS.AES.encrypt(dataString, encryptionKey).toString()
}

// Decrypt data
export function decryptData(encryptedData: string, encryptionKey: string): any {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  } catch (e) {
    console.error("Decryption error:", e)
    return null
  }
}
