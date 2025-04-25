"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileCheck, Info, Share2, Clock, AlertTriangle, Check, Globe, Lock } from "lucide-react"
import type { VerifiableCredential } from "@/lib/types"
import { shortenDID } from "@/lib/crypto-utils"
import { isCredentialExpired, isCredentialRevoked } from "@/lib/credential-utils"

interface CredentialCardProps {
  credential: VerifiableCredential
  onShare: (credential: VerifiableCredential) => void
  disabled?: boolean
  compact?: boolean
}

export function CredentialCard({ credential, onShare, disabled = false, compact = false }: CredentialCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const isExpired = isCredentialExpired(credential)
  const isRevoked = isCredentialRevoked(credential)

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>
      )
    } else if (isRevoked) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Revoked
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Check className="h-3 w-3" />
          Active
        </Badge>
      )
    }
  }

  const getTrustBadge = () => {
    switch (credential.trustLevel) {
      case "verified":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            Verified
          </Badge>
        )
      case "high":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            High Trust
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            Medium Trust
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-500">
            <AlertTriangle className="h-3 w-3" />
            Low Trust
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${disabled ? "opacity-70" : ""}`}>
      <div
        className="p-4"
        style={{
          backgroundColor: credential.display.backgroundColor || "#f3f4f6",
          color: credential.display.textColor || "inherit",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" style={{ color: credential.display.textColor || "inherit" }} />
            <h4 className="font-medium">{credential.display.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {credential.crossBorder && (
              <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-500">
                <Globe className="h-3 w-3" />
                Cross-Border
              </Badge>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm">{credential.display.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="text-xs text-muted-foreground">Issued by: {credential.issuer.name}</p>
          <span className="text-xs text-muted-foreground">•</span>
          <p className="text-xs text-muted-foreground">{new Date(credential.issuanceDate).toLocaleDateString()}</p>
        </div>

        {!compact && credential.expirationDate && (
          <p className="mt-1 text-xs text-muted-foreground">
            Expires: {new Date(credential.expirationDate).toLocaleDateString()}
          </p>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {getTrustBadge()}
          <Badge variant="outline">{credential.category}</Badge>
        </div>

        {!compact && (
          <div className="mt-4 flex justify-end gap-2">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="mr-2 h-4 w-4" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{credential.display.title}</DialogTitle>
                  <DialogDescription>{credential.display.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="text-sm font-medium">Credential ID</h4>
                    <p className="text-sm text-muted-foreground">{credential.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Issuer</h4>
                    <p className="text-sm text-muted-foreground">{credential.issuer.name}</p>
                    <p className="text-sm text-muted-foreground">{shortenDID(credential.issuer.id)}</p>
                    {credential.issuer.country && (
                      <p className="text-sm text-muted-foreground">Country: {credential.issuer.country}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Subject</h4>
                    <p className="text-sm text-muted-foreground">{shortenDID(credential.credentialSubject.id)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Issuance Date</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(credential.issuanceDate).toLocaleString()}
                    </p>
                  </div>
                  {credential.expirationDate && (
                    <div>
                      <h4 className="text-sm font-medium">Expiration Date</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(credential.expirationDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium">Credential Subject Data</h4>
                    <pre className="mt-2 max-h-[200px] overflow-auto rounded bg-muted p-2 text-xs">
                      {JSON.stringify(credential.credentialSubject, null, 2)}
                    </pre>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant={disabled ? "outline" : "default"}
              size="sm"
              onClick={() => onShare(credential)}
              disabled={disabled}
            >
              {disabled ? <Lock className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
              Share
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
