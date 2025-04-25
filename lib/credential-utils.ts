// Enhanced credential utilities for UniID 2.0

import { v4 as uuidv4 } from "uuid"
import { signData, verifySignature } from "./crypto-utils"
import type { VerifiableCredential, CredentialStatus } from "./types"

// Create a new verifiable credential
export function createVerifiableCredential(
  type: string[],
  issuerDID: string,
  issuerName: string,
  subjectDID: string,
  claims: Record<string, any>,
  category: string,
  display: {
    title: string
    description: string
    backgroundColor?: string
    textColor?: string
    logo?: string
  },
  privateKey: string,
  expirationDate?: string,
  trustLevel: "low" | "medium" | "high" | "verified" = "medium",
  crossBorder = false,
): VerifiableCredential {
  const id = `urn:uuid:${uuidv4()}`
  const issuanceDate = new Date().toISOString()

  const credential: VerifiableCredential = {
    "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1"],
    id,
    type: ["VerifiableCredential", ...type],
    issuer: {
      id: issuerDID,
      name: issuerName,
    },
    issuanceDate,
    expirationDate,
    credentialSubject: {
      id: subjectDID,
      ...claims,
    },
    status: "active",
    category,
    trustLevel,
    crossBorder,
    display,
  }

  // Add proof
  const proofCreationDate = new Date().toISOString()
  credential.proof = {
    type: "Ed25519Signature2020",
    created: proofCreationDate,
    proofPurpose: "assertionMethod",
    verificationMethod: `${issuerDID}#keys-1`,
    proofValue: signData(credential, privateKey),
  }

  return credential
}

// Verify a credential
export function verifyCredential(credential: VerifiableCredential, publicKey: string): boolean {
  if (!credential.proof) return false

  const proofValue = credential.proof.proofValue
  const credentialWithoutProof = { ...credential }
  delete credentialWithoutProof.proof

  return verifySignature(credentialWithoutProof, proofValue, publicKey)
}

// Generate a selective disclosure proof
export function generateSelectiveDisclosure(
  credential: VerifiableCredential,
  disclosedAttributes: string[],
  privateKey: string,
): any {
  // In a real implementation, this would use actual ZKP cryptography
  const disclosedClaims: Record<string, any> = {}

  disclosedAttributes.forEach((attr) => {
    if (credential.credentialSubject[attr] !== undefined) {
      disclosedClaims[attr] = credential.credentialSubject[attr]
    }
  })

  const disclosure = {
    "@context": credential["@context"],
    type: [...credential.type, "SelectiveDisclosure"],
    issuer: credential.issuer,
    issuanceDate: credential.issuanceDate,
    credentialSubject: {
      id: credential.credentialSubject.id,
      ...disclosedClaims,
    },
    proof: {
      type: "SelectiveDisclosure2023",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: `${credential.credentialSubject.id}#keys-1`,
      proofValue: signData(
        {
          credentialId: credential.id,
          disclosedAttributes,
        },
        privateKey,
      ),
    },
  }

  return disclosure
}

// Check if a credential is expired
export function isCredentialExpired(credential: VerifiableCredential): boolean {
  if (!credential.expirationDate) return false

  const expirationDate = new Date(credential.expirationDate)
  const currentDate = new Date()

  return currentDate > expirationDate
}

// Check if a credential is revoked
export function isCredentialRevoked(credential: VerifiableCredential): boolean {
  return credential.status === "revoked"
}

// Get credential status with reason
export function getCredentialStatus(credential: VerifiableCredential): { status: CredentialStatus; reason?: string } {
  if (isCredentialExpired(credential)) {
    return { status: "expired", reason: "Credential has expired" }
  }

  if (isCredentialRevoked(credential)) {
    return { status: "revoked", reason: "Credential has been revoked by issuer" }
  }

  return { status: "active" }
}
