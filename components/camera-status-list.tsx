"use client"

import { useEffect, useState } from "react"
import { useBackendService, type Camera as CameraType } from "@/components/backend-service"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, AlertCircle, Camera } from "lucide-react"

export function CameraStatusList() {
  const { service } = useBackendService()
  const [cameras, setCameras] = useState<CameraType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCameras = async () => {
      try {
        const camerasData = await service.getCameras()
        setCameras(camerasData)
      } catch (error) {
        console.error("Error loading cameras:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCameras()
  }, [service])

  if (loading) {
    return (
      <div className="space-y-2">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
      </div>
    )
  }

  if (cameras.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center border rounded-md">
        <div className="text-center">
          <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No cameras configured</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {cameras.map((camera) => (
        <div key={camera.id} className="flex items-center justify-between p-3 border rounded-md">
          <div>
            <p className="font-medium">{camera.name}</p>
            <p className="text-xs text-muted-foreground">{camera.location}</p>
          </div>
          {camera.status === "online" ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Online
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Offline
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}
