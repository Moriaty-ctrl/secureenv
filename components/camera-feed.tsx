"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Maximize2, Volume2, VolumeX, CheckCircle, AlertCircle } from "lucide-react"

interface CameraFeedProps {
  id: string
  name: string
  height?: number
  showControls?: boolean
}

export function CameraFeed({ id, name, height = 240, showControls = false }: CameraFeedProps) {
  const [detections, setDetections] = useState<{ id: number; name: string; status: "verified" | "unknown" }[]>([])
  const [muted, setMuted] = useState(true)

  // Simulate random detections
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddDetection = Math.random() > 0.7

      if (shouldAddDetection) {
        const isVerified = Math.random() > 0.3
        const newDetection = {
          id: Date.now(),
          name: isVerified ? ["Ahmed", "Sarah", "Karim", "Leila", "Omar"][Math.floor(Math.random() * 5)] : "Unknown",
          status: isVerified ? ("verified" as const) : ("unknown" as const),
        }

        setDetections((prev) => [...prev, newDetection])

        // Remove detection after 3 seconds
        setTimeout(() => {
          setDetections((prev) => prev.filter((d) => d.id !== newDetection.id))
        }, 3000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="bg-muted relative" style={{ height: `${height}px` }}>
          <img
            src={`/placeholder.svg?height=${height}&width=${height * 1.33}&text=Camera+Feed:+${name}`}
            alt={`${name} camera feed`}
            className="w-full h-full object-cover"
          />

          {/* Detection overlays */}
          {detections.map((detection) => (
            <div
              key={detection.id}
              className="absolute rounded-md border-2 flex items-center justify-center"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                width: "80px",
                height: "80px",
                borderColor: detection.status === "verified" ? "#22c55e" : "#ef4444",
              }}
            >
              <Badge
                className={`absolute -bottom-6 ${
                  detection.status === "verified"
                    ? "bg-green-500/90 hover:bg-green-500/90"
                    : "bg-red-500/90 hover:bg-red-500/90"
                }`}
              >
                {detection.status === "verified" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" /> {detection.name}
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" /> Unknown
                  </>
                )}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-2">
        <Badge variant="outline">{name}</Badge>
        <div className="flex gap-2">
          {showControls && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setMuted(!muted)}>
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
