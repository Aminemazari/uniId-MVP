"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Download, Globe, Key, LogOut, Moon, Shield, Smartphone, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [backupEnabled, setBackupEnabled] = useState(false)
  const [language, setLanguage] = useState("english")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="text-xl">AL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Profile Photo</h3>
                    <p className="text-sm text-gray-500 mb-2">This photo will be used for your digital identity</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="Alex" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Lee" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="alex.lee@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="did">Decentralized Identifier (DID)</Label>
                  <div className="flex">
                    <Input
                      id="did"
                      defaultValue="did:uniid:1234...5678"
                      readOnly
                      className="rounded-r-none bg-gray-50"
                    />
                    <Button variant="outline" className="rounded-l-none border-l-0">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Your unique identifier on the UniID network</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h3 className="font-medium text-red-700 mb-1">Delete Account</h3>
                    <p className="text-sm text-red-600">
                      Permanently delete your account and all associated credentials. This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Manage your security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-purple-600" />
                      <Label htmlFor="biometric">Biometric Authentication</Label>
                    </div>
                    <p className="text-sm text-gray-500">Use fingerprint or face recognition to unlock your wallet</p>
                  </div>
                  <Switch id="biometric" checked={biometricAuth} onCheckedChange={setBiometricAuth} />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-purple-600" />
                    <h3 className="font-medium">Recovery Phrase</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your recovery phrase is the only way to restore your wallet if you lose access to your device. Keep
                    it in a safe place and never share it with anyone.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline">View Recovery Phrase</Button>
                    <Button>Back Up Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>Manage devices that have access to your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Smartphone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Current Device</h4>
                        <p className="text-xs text-gray-500">Last active: Just now</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                  </div>

                  <Button variant="outline" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out From All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control how your data is used and shared</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <Label htmlFor="zero-knowledge">Zero-Knowledge Proofs</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Use privacy-preserving proofs when sharing credentials (e.g., prove you're over 18 without
                      revealing your birthdate)
                    </p>
                  </div>
                  <Switch id="zero-knowledge" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-purple-600" />
                      <Label htmlFor="notifications">Credential Usage Notifications</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Receive notifications when your credentials are used or verified
                    </p>
                  </div>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-600" />
                      <Label htmlFor="backup">Encrypted Backup</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Securely back up your credentials to the cloud with end-to-end encryption
                    </p>
                  </div>
                  <Switch id="backup" checked={backupEnabled} onCheckedChange={setBackupEnabled} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export or delete your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Your data is stored locally on your device. UniID does not have access to your personal information.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how UniID looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {darkMode ? (
                        <Moon className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Sun className="h-4 w-4 text-purple-600" />
                      )}
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                    <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                  </div>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Set your preferred language and region</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <Label htmlFor="language">Language</Label>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
