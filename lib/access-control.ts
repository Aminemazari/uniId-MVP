// Access control utilities for the UniID 2.0 application
import type { User, AccessLevel, VerificationStatus } from "./types"

// Define access levels based on verification status
export function getAccessLevel(user: User): AccessLevel {
  // Simplified three-tier system
  if (user.documentVerified) {
    return {
      level: "full",
      features: {
        canShare: true,
        canVerify: true,
        offlineSupport: true,
        metaverseAccess: true,
        zkpSupport: true,
      },
    }
  } else if (user.biometricRegistered && user.faceIdRegistered) {
    return {
      level: "partial",
      features: {
        canShare: true,
        canVerify: true,
        offlineSupport: true,
        metaverseAccess: true,
        zkpSupport: false,
      },
    }
  } else {
    return {
      level: "limited",
      features: {
        canShare: user.biometricRegistered,
        canVerify: true,
        offlineSupport: false,
        metaverseAccess: false,
        zkpSupport: false,
      },
    }
  }
}

// Update user verification status based on completed steps
export function updateVerificationStatus(
  user: User,
  biometricRegistered: boolean,
  faceIdRegistered: boolean,
  documentVerified: boolean,
): VerificationStatus {
  if (documentVerified) {
    return "verified"
  } else if (biometricRegistered && faceIdRegistered) {
    return "partial"
  } else {
    return "unverified"
  }
}

// Calculate trust score based on verification status and credentials
export function calculateTrustScore(
  verificationStatus: VerificationStatus,
  biometricRegistered: boolean,
  faceIdRegistered: boolean,
  documentVerified: boolean,
  credentialsCount: number,
  verifiedIssuersCount: number,
): number {
  // Simplified trust score calculation
  let score = 0

  // Base score from verification status
  switch (verificationStatus) {
    case "verified":
      score += 60
      break
    case "partial":
      score += 40
      break
    case "unverified":
      score += 20
      break
    case "revoked":
      return 0 // If revoked, return 0 immediately
  }

  // Additional points for verification methods
  if (biometricRegistered) score += 10
  if (faceIdRegistered) score += 10
  if (documentVerified) score += 20

  // Ensure score is between 0 and 100
  return Math.min(Math.max(score, 0), 100)
}

// Check if user can access a specific feature
export function canAccessFeature(user: User, feature: keyof AccessLevel["features"]): boolean {
  return user.accessLevel.features[feature]
}

// Get feature limitations message
export function getFeatureLimitationMessage(user: User, feature: keyof AccessLevel["features"]): string {
  if (canAccessFeature(user, feature)) {
    return ""
  }

  switch (feature) {
    case "canShare":
      return "Complete biometric registration to share credentials"
    case "metaverseAccess":
      return "Complete face ID verification to connect to metaverse platforms"
    case "zkpSupport":
      return "Complete document verification to use zero-knowledge proofs"
    case "offlineSupport":
      return "Complete face ID verification to use offline mode"
    default:
      return "Complete verification to access this feature"
  }
}
