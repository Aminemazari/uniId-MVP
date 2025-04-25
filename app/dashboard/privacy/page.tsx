"use client"

import { useState } from "react"
import { Shield, Lock, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PrivacyDashboard } from "@/components/privacy-dashboard"
import type { AccessLevel } from "@/lib/types"

export default function PrivacyPage() {
  const [dataSharing, setDataSharing] = useState({
    "Location Data": false,
    "Browsing History": false,
    "Contact Information": true,
    "Financial Information": false,
    "Biometric Data": true,
    "Social Connections": false,
  })

  const [accessLevels, setAccessLevels] = useState<{ [key: string]: AccessLevel }>({
    "Social Media Apps": "limited",
    "Financial Services": "minimal",
    "Government Services": "full",
    "Healthcare Providers": "minimal",
    "Educational Institutions": "limited",
    "Retail Services": "minimal",
  })

  const [privacyScore, setPrivacyScore] = useState(72)

  const handleUpdateDataSharing = (key: string, value: boolean) => {
    setDataSharing((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Update privacy score based on data sharing settings
    const totalItems = Object.keys(dataSharing).length
    const activeItems = Object.values({ ...dataSharing, [key]: value }).filter((v) => v).length
    const sharingImpact = Math.round((1 - activeItems / totalItems) * 40)

    // Calculate new privacy score
    const accessLevelImpact = calculateAccessLevelImpact(accessLevels)
    setPrivacyScore(sharingImpact + accessLevelImpact + 20) // Base score of 20
  }

  const handleUpdateAccessLevel = (key: string, level: AccessLevel) => {
    setAccessLevels((prev) => ({
      ...prev,
      [key]: level,
    }))

    // Update access levels
    const newAccessLevels = { ...accessLevels, [key]: level }
    const accessLevelImpact = calculateAccessLevelImpact(newAccessLevels)

    // Calculate new privacy score
    const sharingImpact = calculateSharingImpact(dataSharing)
    setPrivacyScore(sharingImpact + accessLevelImpact + 20) // Base score of 20
  }

  const calculateSharingImpact = (sharing: typeof dataSharing) => {
    const totalItems = Object.keys(sharing).length
    const activeItems = Object.values(sharing).filter((v) => v).length
    return Math.round((1 - activeItems / totalItems) * 40)
  }

  const calculateAccessLevelImpact = (levels: typeof accessLevels) => {
    const totalItems = Object.keys(levels).length
    const fullAccess = Object.values(levels).filter((v) => v === "full").length
    const limitedAccess = Object.values(levels).filter((v) => v === "limited").length
    const minimalAccess = Object.values(levels).filter((v) => v === "minimal").length

    return Math.round(((minimalAccess * 3 + limitedAccess * 2 + fullAccess) / (totalItems * 3)) * 40)
  }

  const handleRunPrivacyScan = () => {
    // Simulate privacy scan
    const sharingImpact = calculateSharingImpact(dataSharing)
    const accessLevelImpact = calculateAccessLevelImpact(accessLevels)
    setPrivacyScore(sharingImpact + accessLevelImpact + 20) // Base score of 20
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Privacy Settings</h1>
        </div>
        <Button>
          <Lock className="mr-2 h-4 w-4" />
          Lock All Settings
        </Button>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Privacy First</AlertTitle>
        <AlertDescription>
          UniID prioritizes your privacy. All data is stored locally on your device by default, and you control what is
          shared.
        </AlertDescription>
      </Alert>

      <PrivacyDashboard
        dataSharing={dataSharing}
        privacyScore={privacyScore}
        accessLevels={accessLevels}
        onUpdateDataSharing={handleUpdateDataSharing}
        onUpdateAccessLevel={handleUpdateAccessLevel}
        onRunPrivacyScan={handleRunPrivacyScan}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Storage</CardTitle>
            <CardDescription>Control where your data is stored</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Local Storage (Device)</span>
                </div>
                <span className="text-sm text-muted-foreground">Default</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Data stored only on your device. Maximum privacy but no backup.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Encrypted Cloud Backup</span>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                End-to-end encrypted backup. Only you can access your data.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Third-Party Storage</span>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Disabled
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Not recommended. Data would be stored on third-party servers.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Recommendations</CardTitle>
            <CardDescription>Suggestions to improve your privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {privacyScore < 80 && (
              <>
                {Object.entries(dataSharing)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <Alert key={key} variant="destructive" className="py-2">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 mt-0.5 mr-2" />
                        <div>
                          <AlertTitle className="text-sm">Disable {key} sharing</AlertTitle>
                          <AlertDescription className="text-xs">
                            Sharing {key.toLowerCase()} increases your privacy risk.
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}

                {Object.entries(accessLevels)
                  .filter(([_, level]) => level === "full")
                  .map(([key]) => (
                    <Alert key={key} variant="destructive" className="py-2">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 mt-0.5 mr-2" />
                        <div>
                          <AlertTitle className="text-sm">Reduce {key} access</AlertTitle>
                          <AlertDescription className="text-xs">
                            Full access for {key.toLowerCase()} exposes more of your data.
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
              </>
            )}

            {privacyScore >= 80 && (
              <Alert variant="default" className="bg-green-50 border-green-200 py-2">
                <div className="flex items-start">
                  <Info className="h-4 w-4 mt-0.5 mr-2 text-green-500" />
                  <div>
                    <AlertTitle className="text-sm text-green-700">Excellent Privacy Settings</AlertTitle>
                    <AlertDescription className="text-xs text-green-600">
                      Your privacy settings are well-configured. Continue to monitor your data sharing.
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            <Alert variant="default" className="bg-blue-50 border-blue-200 py-2">
              <div className="flex items-start">
                <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-500" />
                <div>
                  <AlertTitle className="text-sm text-blue-700">Enable Two-Factor Authentication</AlertTitle>
                  <AlertDescription className="text-xs text-blue-600">
                    Add an extra layer of security to your account.
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            <Alert variant="default" className="bg-blue-50 border-blue-200 py-2">
              <div className="flex items-start">
                <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-500" />
                <div>
                  <AlertTitle className="text-sm text-blue-700">Review Connected Applications</AlertTitle>
                  <AlertDescription className="text-xs text-blue-600">
                    Regularly review and remove unnecessary application connections.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
