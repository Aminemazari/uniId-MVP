"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ShieldAlert, ShieldCheck, Globe } from "lucide-react"
import { shortenDID } from "@/lib/crypto-utils"
import { useState } from "react"

interface VerificationRequestCardProps {
  request: {
    id: string
    requester: {
      name: string
      did: string
      logo?: string
      country?: string
    }
    requestedCredentials: string[]
    requestedAttributes: string[]
    purpose: string
    expiresAt: string
    status: string
    zkpRequired?: boolean
    crossBorder?: boolean
  }
  onApprove: (requestId: string) => void
  onReject: (requestId: string) => void
}

export function VerificationRequestCard({ request, onApprove, onReject }: VerificationRequestCardProps) {
  const [processing, setProcessing] = useState(false)
  const isExpired = new Date() > new Date(request.expiresAt)

  const handleApprove = () => {
    setProcessing(true)
    // Simulate processing
    setTimeout(() => {
      onApprove(request.id)
      setProcessing(false)
    }, 1000)
  }

  const handleReject = () => {
    setProcessing(true)
    // Simulate processing
    setTimeout(() => {
      onReject(request.id)
      setProcessing(false)
    }, 1000)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ShieldAlert className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{request.requester.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{shortenDID(request.requester.did)}</p>
                {request.requester.country && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">{request.requester.country}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={isExpired ? "destructive" : "outline"} className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isExpired ? "Expired" : "Pending"}
            </Badge>
            {request.crossBorder && (
              <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-500">
                <Globe className="h-3 w-3" />
                Cross-Border
              </Badge>
            )}
            {request.zkpRequired && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                ZKP
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Purpose:</p>
          <p className="text-sm text-muted-foreground">{request.purpose}</p>

          <p className="text-sm font-medium">Requested Credentials:</p>
          <div className="flex flex-wrap gap-2">
            {request.requestedCredentials.map((cred, index) => (
              <Badge key={index} variant="secondary">
                {cred}
              </Badge>
            ))}
          </div>

          <p className="text-sm font-medium">Requested Attributes:</p>
          <div className="flex flex-wrap gap-2">
            {request.requestedAttributes.map((attr, index) => (
              <Badge key={index} variant="outline">
                {attr}
              </Badge>
            ))}
          </div>

          <p className="text-sm font-medium">Expires:</p>
          <p className="text-sm text-muted-foreground">{new Date(request.expiresAt).toLocaleString()}</p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        <Button variant="outline" onClick={handleReject} disabled={isExpired || processing}>
          {processing ? "Processing..." : "Reject"}
        </Button>
        <Button onClick={handleApprove} disabled={isExpired || processing}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          {processing ? "Processing..." : "Approve"}
        </Button>
      </CardFooter>
    </Card>
  )
}
