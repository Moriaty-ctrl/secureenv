"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useBackendService, type Camera } from "@/components/backend-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, CameraIcon, CheckCircle, AlertCircle, Maximize2, Grid2X2, UserCheck, UserX } from "lucide-react"
import { useWebSocket } from "@/components/websocket-provider"

export default function LiveViewPage() {
  const { isAuthenticated, loading } = useAuth()
  const { service } = useBackendService()
  const router = useRouter()
  const { connected, addEventListener } = useWebSocket()

  const [cameras, setCameras] = useState<Camera[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [layout, setLayout] = useState<"grid" | "single">("grid")
  const [activeCamera, setActiveCamera] = useState<number | null>(null)
  const [detections, setDetections] = useState<{ [key: number]: any[] }>({})

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Load cameras data
  useEffect(() => {
    if (isAuthenticated) {
      loadCamerasData()
    }
  }, [isAuthenticated])

  // Listen for real-time detections
  useEffect(() => {
    if (connected) {
      const handleDetection = (data: any) => {
        if (data.camera_id && data.detections) {
          setDetections((prev) => ({
            ...prev,
            [data.camera_id]: data.detections,
          }))
        }
      }

      addEventListener("detection", handleDetection)
    }
  }, [connected, addEventListener])

  const loadCamerasData = async () => {
    setIsLoading(true)
    try {
      const camerasData = await service.getCameras()
      setCameras(camerasData)

      // Set first camera as active if none selected
      if (camerasData.length > 0 && activeCamera === null) {
        setActiveCamera(camerasData[0].id)
      }
    } catch (error) {
      console.error("Error loading cameras data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadCamerasData()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading live view...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live View</h2>
          <p className="text-muted-foreground">Real-time camera monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="icon" onClick={() => setLayout(layout === "grid" ? "single" : "grid")}>
            {layout === "grid" ? <Maximize2 className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1">
          <Skeleton className="h-[500px] w-full" />
        </div>
      ) : cameras.length === 0 ? (
        <div className="flex h-[500px] items-center justify-center border rounded-md">
          <div className="text-center">
            <CameraIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-lg font-medium">No cameras found</p>
            <p className="text-sm text-muted-foreground mt-1">Add cameras in the Camera Management section</p>
            <Button className="mt-4" onClick={() => router.push("/cameras")}>
              Manage Cameras
            </Button>
          </div>
        </div>
      ) : layout === "single" ? (
        <div className="space-y-4">
          <Tabs
            value={activeCamera?.toString() || cameras[0].id.toString()}
            onValueChange={(value) => setActiveCamera(Number.parseInt(value))}
          >
            <TabsList className="mb-4">
              {cameras.map((camera) => (
                <TabsTrigger key={camera.id} value={camera.id.toString()}>
                  <div className="flex items-center gap-2">
                    <CameraIcon className="h-4 w-4" />
                    {camera.name}
                    {camera.status === "online" ? (
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {cameras.map((camera) => (
              <TabsContent key={camera.id} value={camera.id.toString()}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{camera.name}</CardTitle>
                      {camera.status === "online" ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Online
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Offline
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{camera.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center">
                      {camera.status === "online" ? (
                        <>
                          <div className="text-center">
                            <CameraIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Live feed would appear here</p>
                          </div>

                          {/* Detection overlays */}
                          {detections[camera.id]?.map((detection, index) => (
                            <div
                              key={index}
                              className="absolute border-2 border-green-500"
                              style={{
                                left: `${detection.bbox.x}%`,
                                top: `${detection.bbox.y}%`,
                                width: `${detection.bbox.width}%`,
                                height: `${detection.bbox.height}%`,
                              }}
                            >
                              <div
                                className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium ${detection.verified ? "bg-green-500" : "bg-amber-500"} text-white rounded-t-md`}
                              >
                                {detection.name} ({detection.confidence.toFixed(1)}%)
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-center">
                          <AlertCircle className="h-10 w-10 mx-auto mb-2 text-red-500" />
                          <p className="text-sm text-muted-foreground">Camera offline</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Resolution: {camera.resolution}</div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                      >
                        <UserCheck className="h-3 w-3" />
                        {detections[camera.id]?.filter((d) => d.verified).length || 0} Verified
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                      >
                        <UserX className="h-3 w-3" />
                        {detections[camera.id]?.filter((d) => !d.verified).length || 0} Unknown
                      </Badge>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {cameras.map((camera) => (
            <Card key={camera.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{camera.name}</CardTitle>
                  {camera.status === "online" ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                    >
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
                <CardDescription>{camera.location}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center">
                  {camera.status === "online" ? (
                    <>
                      <div className="text-center">
                        <CameraIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Live feed would appear here</p>
                      </div>

                      {/* Detection overlays */}
                      {detections[camera.id]?.map((detection, index) => (
                        <div
                          key={index}
                          className="absolute border-2 border-green-500"
                          style={{
                            left: `${detection.bbox.x}%`,
                            top: `${detection.bbox.y}%`,
                            width: `${detection.bbox.width}%`,
                            height: `${detection.bbox.height}%`,
                          }}
                        >
                          <div
                            className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium ${detection.verified ? "bg-green-500" : "bg-amber-500"} text-white rounded-t-md`}
                          >
                            {detection.name} ({detection.confidence.toFixed(1)}%)
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center">
                      <AlertCircle className="h-10 w-10 mx-auto mb-2 text-red-500" />
                      <p className="text-sm text-muted-foreground">Camera offline</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveCamera(camera.id)
                    setLayout("single")
                  }}
                >
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Expand
                </Button>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                  >
                    <UserCheck className="h-3 w-3" />
                    {detections[camera.id]?.filter((d) => d.verified).length || 0}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                  >
                    <UserX className="h-3 w-3" />
                    {detections[camera.id]?.filter((d) => !d.verified).length || 0}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
