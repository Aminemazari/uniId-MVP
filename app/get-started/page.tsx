"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, FileCheck, Building, Fingerprint } from "lucide-react"

export default function GetStartedPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Update the slides array to reflect the mandatory steps
  const slides = [
    {
      title: "Welcome to UniID",
      description: "Your secure decentralized identity and credential wallet",
      icon: <ShieldCheck className="h-16 w-16 text-primary" />,
      content:
        "Take control of your digital identity with UniID. Securely store, manage, and share your credentials while maintaining your privacy.",
    },
    {
      title: "Required Setup",
      description: "Biometric and Face ID registration are required",
      icon: <Fingerprint className="h-16 w-16 text-primary" />,
      content:
        "To ensure the security of your identity, biometric and Face ID registration are mandatory steps in the account creation process.",
    },
    {
      title: "Document Verification",
      description: "Optional but recommended for full access",
      icon: <FileCheck className="h-16 w-16 text-primary" />,
      content:
        "Document verification is optional but required to unlock full access to all features, including financial services. Without document verification, your access will be limited.",
    },
    {
      title: "Financial Services Access",
      description: "Verified users get complete financial access",
      icon: <Building className="h-16 w-16 text-primary" />,
      content:
        "Document verification is required to access financial services. Limited access users can easily upgrade anytime by completing the document verification process.",
    },
    \
### UniID 2.0: Enhanced Digital Identity Wallet

I'll create an improved version of the UniID app that builds upon the existing implementation while incorporating the enhancements from the specification analysis.

First, let's create an improved theme with a more modern color scheme:
