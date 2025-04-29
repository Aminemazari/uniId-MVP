"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getUserData } from "@/lib/storage-utils"
import { BottomNav } from "@/components/bottom-nav"
import type { User } from "@/lib/types"
import { mockUser, mockUserLimited, mockUserPartial } from "@/lib/mock-data"
import { BadgeCheck, UserIcon } from "lucide-react"

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
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <BadgeCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">UniID</span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="flex items-center">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-full w-full p-1.5" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
