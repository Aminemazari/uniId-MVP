"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentUploadProps {
  onUpload: (success: boolean) => void
  processing: boolean
  setProcessing: (processing: boolean) => void
}

export function DocumentUpload({ onUpload, processing, setProcessing }: DocumentUploadProps) {
  const { toast } = useToast()
  const [documentType, setDocumentType] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // Update the handleUpload function to show that full access is granted
  const handleUpload = () => {
    if (!file || !documentType) {
      toast({
        title: "Missing information",
        description: "Please select a document type and upload a file",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    // Simulate document verification process
    setTimeout(() => {
      setUploadStatus("success")
      setProcessing(false)
      onUpload(true)

      toast({
        title: "Document verified successfully",
        description: "You now have full access to all features including financial services",
      })
    }, 3000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document-type">Document Type</Label>
        <Select
          value={documentType}
          onValueChange={setDocumentType}
          disabled={processing || uploadStatus === "success"}
        >
          <SelectTrigger id="document-type">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="nationalId">National ID Card</SelectItem>
            <SelectItem value="driversLicense">Driver's License</SelectItem>
            <SelectItem value="residencePermit">Residence Permit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="document-file">Upload Document</Label>
        <div className="flex items-center gap-2">
          <Input
            id="document-file"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            disabled={processing || uploadStatus === "success"}
            className="hidden"
          />
          <div className="flex-1">
            <Label
              htmlFor="document-file"
              className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed ${
                previewUrl ? "border-primary" : "border-muted-foreground"
              } bg-muted/50 px-4 py-2 text-center hover:bg-muted`}
            >
              {previewUrl ? (
                <div className="relative h-full w-full">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Document preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <>
                  <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Click to upload or drag and drop</span>
                  <span className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF (max 10MB)</span>
                </>
              )}
            </Label>
          </div>
        </div>
      </div>

      {uploadStatus === "success" ? (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <Check className="h-5 w-5" />
          <span>Document uploaded successfully and is being verified</span>
        </div>
      ) : uploadStatus === "error" ? (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="h-5 w-5" />
          <span>There was an error uploading your document. Please try again.</span>
        </div>
      ) : null}

      <Button
        onClick={handleUpload}
        disabled={!file || !documentType || processing || uploadStatus === "success"}
        className="w-full"
      >
        {processing ? "Processing..." : uploadStatus === "success" ? "Uploaded" : "Upload Document"}
      </Button>
    </div>
  )
}
