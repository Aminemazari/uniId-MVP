"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QrCode, Smartphone, Share2, Shield, Copy, Check, Globe } from "lucide-react"
import type { VerifiableCredential } from "@/lib/types"
import { generateCredentialQR } from "@/lib/qr-utils"
import { useToast } from "@/hooks/use-toast"

interface ShareCredentialDialogProps {
  credential: VerifiableCredential
  holderDID: string
  privateKey: string
  open: boolean
  onOpenChange: (open: boolean) => void
  zkpEnabled?: boolean
}

export function ShareCredentialDialog({
  credential,
  holderDID,
  privateKey,
  open,
  onOpenChange,
  zkpEnabled = false,
}: ShareCredentialDialogProps) {
  const { toast } = useToast()
  const [shareMethod, setShareMethod] = useState<"qr" | "nfc" | "link">("qr")
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(
    Object.keys(credential.credentialSubject).filter((key) => key !== "id"),
  )
  const [useZkp, setUseZkp] = useState(zkpEnabled)
  const [copied, setCopied] = useState(false)
  const [qrCodeData, setQrCodeData] = useState("")

  // Generate QR code data when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // In a real app, this would generate a proper QR code with the credential data
      const qrData = generateCredentialQR(credential.id, holderDID, privateKey)
      setQrCodeData(qrData)
    }
    onOpenChange(open)
  }

  // Toggle attribute selection
  const toggleAttribute = (attribute: string) => {
    if (selectedAttributes.includes(attribute)) {
      setSelectedAttributes(selectedAttributes.filter((attr) => attr !== attribute))
    } else {
      setSelectedAttributes([...selectedAttributes, attribute])
    }
  }

  // Select all attributes
  const selectAllAttributes = () => {
    setSelectedAttributes(Object.keys(credential.credentialSubject).filter((key) => key !== "id"))
  }

  // Clear all attributes
  const clearAllAttributes = () => {
    setSelectedAttributes([])
  }

  // Copy sharing link
  const copyLink = () => {
    // In a real app, this would generate a proper sharing link
    const sharingLink = `https://uniid.app/share/${credential.id}`
    navigator.clipboard.writeText(sharingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Link copied",
      description: "Credential sharing link copied to clipboard",
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Credential</DialogTitle>
          <DialogDescription>
            Share your {credential.display.title} credential securely with selective disclosure.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="attributes" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="sharing">Sharing Method</TabsTrigger>
          </TabsList>

          <TabsContent value="attributes" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Select attributes to share</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearAllAttributes}>
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={selectAllAttributes}>
                  All
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {Object.entries(credential.credentialSubject)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`attribute-${key}`}
                      checked={selectedAttributes.includes(key)}
                      onCheckedChange={() => toggleAttribute(key)}
                    />
                    <Label htmlFor={`attribute-${key}`} className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>{key}</span>
                        <span className="text-muted-foreground text-sm truncate max-w-[150px]">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
            </div>

            {zkpEnabled && (
              <div className="flex items-center space-x-2 pt-2 border-t">
                <Checkbox id="use-zkp" checked={useZkp} onCheckedChange={(checked) => setUseZkp(!!checked)} />
                <Label htmlFor="use-zkp" className="flex items-center gap-1 cursor-pointer">
                  <Shield className="h-4 w-4 text-primary" />
                  Use Zero-Knowledge Proofs
                </Label>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sharing" className="py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button
                  variant={shareMethod === "qr" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-1"
                  onClick={() => setShareMethod("qr")}
                >
                  <QrCode className="h-6 w-6" />
                  <span className="text-xs">QR Code</span>
                </Button>
                <Button
                  variant={shareMethod === "nfc" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-1"
                  onClick={() => setShareMethod("nfc")}
                >
                  <Smartphone className="h-6 w-6" />
                  <span className="text-xs">NFC</span>
                </Button>
                <Button
                  variant={shareMethod === "link" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-1"
                  onClick={() => setShareMethod("link")}
                >
                  <Share2 className="h-6 w-6" />
                  <span className="text-xs">Link</span>
                </Button>
              </div>

              {shareMethod === "qr" && (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-48 w-48 bg-white p-2 rounded-lg flex items-center justify-center">
                    {/* In a real app, this would be a proper QR code component */}
                    <div className="h-full w-full bg-[url('/placeholder.svg?height=180&width=180')] bg-center bg-no-repeat bg-contain"></div>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Scan this QR code to share your credential
                  </p>
                </div>
              )}

              {shareMethod === "nfc" && (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-48 w-48 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Smartphone className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Tap your device to another NFC-enabled device to share
                  </p>
                </div>
              )}

              {shareMethod === "link" && (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="flex w-full items-center space-x-2">
                    <div className="flex-1 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                      https://uniid.app/share/{credential.id.split(":").pop()}
                    </div>
                    <Button size="sm" onClick={copyLink}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Copy and share this link to share your credential
                  </p>
                </div>
              )}

              {credential.crossBorder && (
                <div className="flex items-center gap-2 rounded-md bg-blue-50 p-2 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-full">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs">
                    This credential is recognized across borders and can be used internationally.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:w-auto w-full">
            Cancel
          </Button>
          <Button
            className="sm:w-auto w-full"
            disabled={selectedAttributes.length === 0}
            onClick={() => {
              toast({
                title: "Credential shared",
                description: `Shared ${selectedAttributes.length} attributes from ${credential.display.title}`,
              })
              onOpenChange(false)
            }}
          >
            <Shield className="mr-2 h-4 w-4" />
            {useZkp ? "Share with ZKP" : "Share Credential"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
