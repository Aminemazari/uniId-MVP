"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Moon,
  Sun,
  Laptop,
  Lock,
  Fingerprint,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getUserData, storeUserData } from "@/lib/storage-utils"
import { canAccessFeature } from "@/lib/access-control"
import type { User } from "@/lib/types"
import { mockUser, mockUserLimited, mockUserPartial } from "@/lib/mock-data"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<User>(mockUser)
  const [saving, setSaving] = useState(false)

  // Load user data
  useEffect(() => {
    const userData = getUserData("temp-encryption-key")
    if (userData) {
      // For demo purposes, we'll use mock users based on verification status
      if (userData.verificationStatus === "verified") {
        setCurrentUser(mockUser)
      } else if (userData.verificationStatus === "partial") {
        setCurrentUser(mockUserPartial)
      } else {
        setCurrentUser(mockUserLimited)
      }
    }
  }, [])

  const handleSaveSettings = () => {
    setSaving(true)

    // Simulate saving settings
    setTimeout(() => {
      storeUserData(currentUser, "temp-encryption-key")
      setSaving(false)

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      })
    }, 1000)
  }

  const updateSettings = (key: keyof User["settings"], value: any) => {
    setCurrentUser({
      ...currentUser,
      settings: {
        ...currentUser.settings,
        [key]: value,
      },
    })
  }

  const canUseOfflineMode = canAccessFeature(currentUser, "offlineSupport")
  const canUseZkp = canAccessFeature(currentUser, "zkpSupport")

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how UniID looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={currentUser.settings.theme} onValueChange={(value) => updateSettings("theme", value)}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={currentUser.settings.language}
                onValueChange={(value) => updateSettings("language", value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notifications</Label>
                <Switch
                  id="notifications"
                  checked={currentUser.settings.notifications}
                  onCheckedChange={(checked) => updateSettings("notifications", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Receive notifications about credential updates and verification requests
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="biometrics">Use Biometrics</Label>
                <Switch
                  id="biometrics"
                  checked={currentUser.settings.useBiometrics}
                  onCheckedChange={(checked) => updateSettings("useBiometrics", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">Use fingerprint or face ID to unlock your wallet</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="privacy-mode">Privacy Mode</Label>
                <Switch
                  id="privacy-mode"
                  checked={currentUser.settings.privacyMode}
                  onCheckedChange={(checked) => updateSettings("privacyMode", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">Hide sensitive information when sharing your screen</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auto-lock">Auto-Lock (minutes)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="auto-lock"
                  min={1}
                  max={30}
                  step={1}
                  value={[currentUser.settings.autoLock]}
                  onValueChange={(value) => updateSettings("autoLock", value[0])}
                />
                <span className="text-sm font-medium">{currentUser.settings.autoLock} min</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically lock your wallet after a period of inactivity
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="zkp">Zero-Knowledge Proofs</Label>
                  {!canUseZkp && (
                    <Badge variant="outline" className="text-xs">
                      Requires Full Access
                    </Badge>
                  )}
                </div>
                <Switch
                  id="zkp"
                  checked={currentUser.settings.useZkp && canUseZkp}
                  onCheckedChange={(checked) => updateSettings("useZkp", checked)}
                  disabled={!canUseZkp}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {canUseZkp
                  ? "Share credentials without revealing all information"
                  : "Document verification required to enable zero-knowledge proofs"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="offline-mode">Offline Mode</Label>
                  {!canUseOfflineMode && (
                    <Badge variant="outline" className="text-xs">
                      Requires Partial Access
                    </Badge>
                  )}
                </div>
                <Switch
                  id="offline-mode"
                  checked={currentUser.settings.offlineMode && canUseOfflineMode}
                  onCheckedChange={(checked) => updateSettings("offlineMode", checked)}
                  disabled={!canUseOfflineMode}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {canUseOfflineMode
                  ? "Use your credentials without an internet connection"
                  : "Face ID verification required to enable offline mode"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup & Recovery</CardTitle>
            <CardDescription>Manage your backup and recovery options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="backup-enabled">Automatic Backup</Label>
                <Switch
                  id="backup-enabled"
                  checked={currentUser.settings.backupEnabled}
                  onCheckedChange={(checked) => updateSettings("backupEnabled", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">Automatically backup your credentials and settings</p>
            </div>

            {currentUser.settings.backupEnabled && currentUser.settings.lastBackupDate && (
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    Last backup: {new Date(currentUser.settings.lastBackupDate).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Create Manual Backup
              </Button>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Restore from Backup
              </Button>
            </div>

            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Recovery Phrase</AlertTitle>
              <AlertDescription>
                Your recovery phrase is the only way to recover your wallet if you lose access to your device.
                <Button variant="link" className="h-auto p-0 pl-1">
                  View Recovery Phrase
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced</CardTitle>
            <CardDescription>Advanced settings and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Identity Information</Label>
              <div className="rounded-md bg-muted p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">DID:</span>
                  <span className="font-mono text-xs truncate">{currentUser.did}</span>
                  <span className="text-muted-foreground">Verification Status:</span>
                  <span>{currentUser.verificationStatus}</span>
                  <span className="text-muted-foreground">Trust Score:</span>
                  <span>{currentUser.trustScore}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Change Security Settings
              </Button>
              <Button variant="outline">
                <Fingerprint className="mr-2 h-4 w-4" />
                Manage Biometric Data
              </Button>
              <Button variant="outline">
                <Globe className="mr-2 h-4 w-4" />
                Manage Connected Services
              </Button>
            </div>

            <Separator />

            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
