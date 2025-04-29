"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Battery, Signal, Wifi } from "lucide-react"

export function MobileDeviceFrame({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      setCurrentTime(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Status bar */}
      <div className="sticky top-0 z-[60] flex justify-between items-center px-4 py-2 bg-background/80 backdrop-blur-sm">
        <div className="text-xs font-medium">{currentTime}</div>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5" />
          <Wifi className="h-3.5 w-3.5" />
          <Battery className="h-4 w-4" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
