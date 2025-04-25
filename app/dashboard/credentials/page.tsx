"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet, Plus, Search, Filter, AlertTriangle, FileCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockCredentials } from "@/lib/mock-data"
import { CredentialCard } from "@/components/credential-card"
import { ShareCredentialDialog } from "@/components/share-credential-dialog"
import { useToast } from "@/hooks/use-toast"
import { getUserData } from "@/lib/storage-utils"
import { canAccessFeature, getFeatureLimitationMessage } from "@/lib/access-control"
import type { User, VerifiableCredential } from "@/lib/types"
import { mockUser, mockUserLimited, mockUserPartial } from "@/lib/mock-data"

export default function CredentialsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCredential, setSelectedCredential] = useState<VerifiableCredential | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>(mockUser)

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

  // Filter credentials based on search query and active tab
  const filteredCredentials = mockCredentials.filter((credential) => {
    const matchesSearch =
      searchQuery === "" ||
      credential.display.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.display.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.issuer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && credential.status === "active") ||
      (activeTab === "education" && credential.category === "education") ||
      (activeTab === "government" && credential.category === "government") ||
      (activeTab === "health" && credential.category === "health") ||
      (activeTab === "professional" && credential.category === "professional")

    return matchesSearch && matchesTab
  })

  const handleShareCredential = (credential: VerifiableCredential) => {
    if (!canAccessFeature(currentUser, "canShare")) {
      toast({
        title: "Access Restricted",
        description: getFeatureLimitationMessage(currentUser, "canShare"),
        variant: "destructive",
      })
      return
    }

    setSelectedCredential(credential)
    setShareDialogOpen(true)
  }

  const canAddCredentials = canAccessFeature(currentUser, "canShare")
  const canUseZkp = canAccessFeature(currentUser, "zkpSupport")

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Credentials</h2>
        </div>
        <Button onClick={() => router.push("/dashboard/credentials/add")} disabled={!canAddCredentials}>
          <Plus className="mr-2 h-4 w-4" />
          Add Credential
        </Button>
      </div>

      {!canAddCredentials && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Limited Access</AlertTitle>
          <AlertDescription>{getFeatureLimitationMessage(currentUser, "canShare")}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search credentials..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCredentials.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileCheck className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-center text-muted-foreground">No credentials found</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCredentials.map((credential) => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  onShare={handleShareCredential}
                  disabled={!canAddCredentials}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedCredential && (
        <ShareCredentialDialog
          credential={selectedCredential}
          holderDID={currentUser.did}
          privateKey={currentUser.keyPair.privateKey}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          zkpEnabled={canUseZkp}
        />
      )}
    </div>
  )
}
