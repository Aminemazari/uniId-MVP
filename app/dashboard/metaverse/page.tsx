"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe, Plus, User, Check, X, Clock, Lock, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getUserData } from "@/lib/storage-utils"
import { canAccessFeature, getFeatureLimitationMessage } from "@/lib/access-control"
import type { User as UserType, MetaverseConnection } from "@/lib/types"
import { mockUser, mockUserLimited, mockUserPartial, mockMetaverseConnections } from "@/lib/mock-data"

export default function MetaversePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("connections")
  const [currentUser, setCurrentUser] = useState<UserType>(mockUser)
  const [connections, setConnections] = useState<MetaverseConnection[]>(mockMetaverseConnections)

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

  const canAccessMetaverse = canAccessFeature(currentUser, "metaverseAccess")
  const metaverseAccessMessage = getFeatureLimitationMessage(currentUser, "metaverseAccess")

  const handleDisconnect = (connectionId: string) => {
    toast({
      title: "Platform disconnected",
      description: "Your identity is no longer connected to this platform",
    })

    setConnections(connections.filter((conn) => conn.id !== connectionId))
  }

  const handleToggleConnection = (connectionId: string, active: boolean) => {
    setConnections(
      connections.map((conn) =>
        conn.id === connectionId ? { ...conn, status: active ? "active" : "inactive" } : conn,
      ),
    )

    toast({
      title: active ? "Connection activated" : "Connection deactivated",
      description: active
        ? "Your identity is now active on this platform"
        : "Your identity is now inactive on this platform",
    })
  }

  if (!canAccessMetaverse) {
    return (
      <div className="container space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Metaverse Connections</h2>
          </div>
        </div>

        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            {metaverseAccessMessage}
            <Button variant="link" className="h-auto p-0 pl-1" onClick={() => router.push("/onboarding?step=2")}>
              Complete face ID verification
            </Button>
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <Globe className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Metaverse Access Locked</h3>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Face ID verification is required to connect your identity to metaverse platforms. This ensures your
              digital identity is protected across virtual worlds.
            </p>
            <Button onClick={() => router.push("/onboarding?step=2")}>
              <User className="mr-2 h-4 w-4" />
              Verify Face ID Now
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Metaverse Connections</h2>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Connect Platform
        </Button>
      </div>

      <Tabs defaultValue="connections" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connections">Active Connections</TabsTrigger>
          <TabsTrigger value="avatars">Digital Avatars</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-6 space-y-4">
          {connections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Globe className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-center text-muted-foreground">No metaverse connections</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Connect Platform
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {connections.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{connection.name}</CardTitle>
                      <Badge variant={connection.status === "active" ? "default" : "outline"}>
                        {connection.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{connection.platform}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avatar ID</span>
                        <span className="text-sm font-medium">{connection.avatarId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Connected</span>
                        <span className="text-sm">{new Date(connection.connectedAt).toLocaleDateString()}</span>
                      </div>
                      {connection.expiresAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Expires</span>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{new Date(connection.expiresAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                      {connection.sharedAttributes && connection.sharedAttributes.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground">Shared Attributes</span>
                          <div className="flex flex-wrap gap-1">
                            {connection.sharedAttributes.map((attr, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {attr}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`connection-${connection.id}`}
                        checked={connection.status === "active"}
                        onCheckedChange={(checked) => handleToggleConnection(connection.id, checked)}
                      />
                      <Label htmlFor={`connection-${connection.id}`} className="text-sm">
                        {connection.status === "active" ? "Active" : "Inactive"}
                      </Label>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect(connection.id)}>
                      <X className="mr-2 h-3 w-3" />
                      Disconnect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="avatars" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Digital Avatars</CardTitle>
              <CardDescription>Manage your digital avatars across metaverse platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center rounded-lg border p-4">
                  <div className="h-24 w-24 rounded-full bg-muted mb-4">
                    <img
                      src="/placeholder.svg?height=96&width=96"
                      alt="Avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">Professional</h3>
                  <p className="text-sm text-muted-foreground">EduVerse, CareerMetaverse</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      <Check className="mr-1 h-2 w-2" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-lg border p-4">
                  <div className="h-24 w-24 rounded-full bg-muted mb-4">
                    <img
                      src="/placeholder.svg?height=96&width=96"
                      alt="Avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">Casual</h3>
                  <p className="text-sm text-muted-foreground">GamingVerse</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      <Eye className="mr-1 h-2 w-2" />
                      Public
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-lg border border-dashed p-4">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Create Avatar</h3>
                  <p className="text-sm text-muted-foreground">Add a new digital identity</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="mr-2 h-3 w-3" />
                    Create
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control how your avatars share information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Cross-Platform Identity</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow platforms to recognize you across different metaverses
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Credential Sharing</Label>
                  <p className="text-sm text-muted-foreground">Allow platforms to access your verified credentials</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Anonymous Mode</Label>
                  <p className="text-sm text-muted-foreground">Use your avatars without revealing your real identity</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
