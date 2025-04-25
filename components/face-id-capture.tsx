"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Check, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FaceIdCaptureProps {
  onCapture: (success: boolean) => void
  processing: boolean
  setProcessing: (processing: boolean) => void
}

export function FaceIdCapture({ onCapture, processing, setProcessing }: FaceIdCaptureProps) {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraActive(true)
      // Simulate face detection after a delay
      setTimeout(() => {
        setFaceDetected(true)
      }, 2000)
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setCameraActive(false)
    setFaceDetected(false)
  }

  // Capture image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
        stopCamera()

        // Process the face ID
        setProcessing(true)
        // Simulate processing
        setTimeout(() => {
          setProcessing(false)
          onCapture(true)
        }, 3000)
      }
    }
  }

  // Reset capture
  const resetCapture = () => {
    setCapturedImage(null)
    startCamera()
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-64 w-64 overflow-hidden rounded-lg border-2 border-dashed">
        {capturedImage ? (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured face" className="h-full w-full object-cover" />
        ) : cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              onCanPlay={() => videoRef.current?.play()}
            />
            {faceDetected && (
              <div className="absolute inset-0 border-4 border-green-500 animate-pulse pointer-events-none" />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {capturedImage ? (
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetCapture} disabled={processing}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake
          </Button>
          <Button disabled={processing}>
            {processing ? "Processing..." : <Check className="mr-2 h-4 w-4" />}
            {processing ? "Processing..." : "Confirm"}
          </Button>
        </div>
      ) : cameraActive ? (
        <Button onClick={captureImage} disabled={!faceDetected}>
          <Camera className="mr-2 h-4 w-4" />
          {faceDetected ? "Capture" : "Detecting face..."}
        </Button>
      ) : (
        <Button onClick={startCamera}>
          <Camera className="mr-2 h-4 w-4" />
          Start Camera
        </Button>
      )}
    </div>
  )
}
