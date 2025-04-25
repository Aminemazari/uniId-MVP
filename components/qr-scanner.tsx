"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose?: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Start camera and QR scanning
  const startScanner = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
        },
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setScanning(true)
        setError(null)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please check permissions.")
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Stop camera and QR scanning
  const stopScanner = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setScanning(false)
  }

  // Simulate QR code detection
  const simulateQRDetection = () => {
    // In a real app, this would use a proper QR code scanning library
    // For demo purposes, we'll simulate a successful scan after a delay
    setTimeout(() => {
      const mockQRData = JSON.stringify({
        type: "VerificationRequest",
        requestId: "req-" + Math.random().toString(36).substring(2, 10),
        verifierDID: "did:uniid:" + Math.random().toString(36).substring(2, 10),
        requestedCredentials: ["DriversLicenseCredential", "VaccinationCredential"],
        timestamp: new Date().toISOString(),
      })

      onScan(mockQRData)
      stopScanner()
    }, 3000)
  }

  // Start scanning when component mounts
  useEffect(() => {
    startScanner()
    return () => {
      stopScanner()
    }
  }, [])

  // Simulate QR detection when scanning is active
  useEffect(() => {
    if (scanning) {
      simulateQRDetection()
    }
  }, [scanning])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {error ? (
            <div className="flex flex-col items-center justify-center p-8 gap-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <p className="text-center text-destructive">{error}</p>
              <Button onClick={startScanner}>Try Again</Button>
            </div>
          ) : (
            <>
              <div className="relative h-64 w-full overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  onCanPlay={() => videoRef.current?.play()}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-40 w-40 border-2 border-white rounded-lg"></div>
                </div>
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-40 w-40 border-2 border-primary animate-scan rounded-lg"></div>
                  </div>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={onClose || stopScanner}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
