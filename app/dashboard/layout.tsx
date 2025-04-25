"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getUserData } from "@/lib/storage-utils"
import { UnifiedNav } from "@/components/unified-nav"
import type { User } from "@/lib/types"
import { mockUser, mockUserLimited, mockUserPartial } from "@/lib/mock-data"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user data
  useEffect(() => {
    const userData = getUserData("temp-encryption-key")
    if (userData) {
      // For demo purposes, we'll use mock users based on verification status
      let user: User
      if (userData.verificationStatus === "verified") {
        user = mockUser
      } else if (userData.verificationStatus === "partial") {
        user = mockUserPartial
      } else {
        user = mockUserLimited
      }

      setCurrentUser(user)
    } else {
      // If no user data, use limited user for demo
      setCurrentUser(mockUserLimited)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedNav user={currentUser} notificationCount={3} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </div>
  )
}
