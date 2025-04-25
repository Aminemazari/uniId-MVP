// Enhanced QR code utilities for UniID 2.0

import { encryptData } from "./crypto-utils"

// Generate a QR code for a credential
export function generateCredentialQR(credentialId: string, holderDID: string, privateKey: string): string {
  // Create a secure presentation with encryption
  const qrData = {
    type: "CredentialPresentation",
    credentialId,
    holderDID,
    timestamp: new Date().toISOString(),
    nonce: Math.random().toString(36).substring(2, 15),
  }

  // Sign and encrypt the data
  return encryptData(qrData, privateKey)
}

// Generate a QR code for verification request
export function generateVerificationRequestQR(
  requestId: string,
  verifierDID: string,
  requestedCredentials: string[],
  requestedAttributes: string[] = [],
  privateKey: string,
): string {
  // Create a secure verification request with encryption
  const qrData = {
    type: "VerificationRequest",
    requestId,
    verifierDID,
    requestedCredentials,
    requestedAttributes,
    timestamp: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    nonce: Math.random().toString(36).substring(2, 15),
  }

  // Sign and encrypt the data
  return encryptData(qrData, privateKey)
}

// Parse a scanned QR code
export function parseQRCode(qrData: string, decryptionKey: string): any {
  try {
    // In a real implementation, this would decrypt and verify the QR data
    return JSON.parse(qrData)
  } catch (e) {
    console.error("Error parsing QR code:", e)
    return null
  }
}

// Validate a credential presentation QR
export function validateCredentialPresentationQR(qrData: any): boolean {
  if (!qrData) return false

  return (
    qrData.type === "CredentialPresentation" &&
    qrData.credentialId &&
    qrData.holderDID &&
    qrData.timestamp &&
    qrData.nonce
  )
}

// Validate a verification request QR
export function validateVerificationRequestQR(qrData: any): boolean {
  if (!qrData) return false

  return (
    qrData.type === "VerificationRequest" &&
    qrData.requestId &&
    qrData.verifierDID &&
    qrData.requestedCredentials &&
    qrData.timestamp &&
    qrData.expiresAt &&
    qrData.nonce
  )
}

// Check if a verification request is expired
export function isVerificationRequestExpired(qrData: any): boolean {
  if (!qrData || !qrData.expiresAt) return true

  const expirationDate = new Date(qrData.expiresAt)
  const currentDate = new Date()

  return currentDate > expirationDate
}

// Generate a deep link for credential sharing
export function generateCredentialDeepLink(credentialId: string, holderDID: string, privateKey: string): string {
  const qrData = generateCredentialQR(credentialId, holderDID, privateKey)
  return `uniid://share?data=${encodeURIComponent(qrData)}`
}
