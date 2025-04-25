"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Shield, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Credential } from "@/lib/types"

interface SelectiveDisclosureProps {
  credential: Credential
  requestingParty: {
    name: string
    id: string
    logoUrl: string
    trustScore: number
  }
  onApprove: (disclosedFields: string[]) => void
  onDeny: () => void
}

export function SelectiveDisclosure({
  credential,
  requestingParty,
  onApprove,
  onDeny
}: SelectiveDisclosureProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  
  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field))
    } else {
      setSelectedFields([...selectedFields, field])
    }
  }
  
  const selectAll = () => {
    setSelectedFields(Object.keys(credential.claims))
  }
  
  const selectNone = () => {
    setSelectedFields([])
  }
  
  const handleApprove = () => {
    onApprove(selectedFields)
  }
  
  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Selective Disclosure</CardTitle>
          <Badge variant="outline" className="flex items-center">
            <Shield className="mr-1 h-3 w-3" />
            ZKP Enabled
          </Badge>
        </div>
        <CardDescription>
          Choose which information to share with {requestingParty.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img 
              src={requestingParty.logoUrl || '/placeholder.svg?height=48&width=48'} 
              alt={requestingParty.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{requestingParty.name}</h3>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${getTrustScoreColor(requestingParty.trustScore)}`}></div>
              <span className="text-xs text-muted-foreground">
                Trust Score: {requestingParty.trustScore}
              </span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Credential: {credential.name}</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={selectNone}>None</Button>
              <Button variant="ghost" size="sm" onClick={selectAll}>All</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {Object.entries(credential.claims).slice(0, expanded ? undefined : 3).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center space-x-2">
                  {selectedFields.includes(key) ? 
                    <Eye className="h-4 w-4 text-primary" /> : 
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  }
                  <span className="text-sm">{key}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {selectedFields.includes(key) ? String(value) : '•••••••'}
                  </span>
                  <Switch
                    checked={selectedFields.includes(key)}
                    onCheckedChange={() => toggleField(key)}
                  />
                </div>
              </div>
            ))}
            
            {Object.keys(credential.claims).length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show {Object.keys(credential.claims).length - 3} More
                  </>
                )}
              </Button>
            )}

I'll create an improved version of the UniID app that builds upon the existing implementation while incorporating the enhancements from the specification analysis.

First, let&apos;s create an improved theme with a more modern color scheme:

\
