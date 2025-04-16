"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useBackendService, type Camera } from "@/components/backend-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Plus, CameraIcon, CheckCircle, AlertCircle, Settings, Play, Pause } from "lucide-react"

export default function CamerasPage() {
  const { isAuthenticated, loading } = useAuth()
  const { service } = useBackendService()
  const router = useRouter()

  const [cameras, setCameras] = useState<Camera[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isAddCameraDialogOpen, setIsAddCameraDialogOpen] = useState(false)
  const [newCamera, setNewCamera] = useState({
    name: "",
    location: "",
    url: "",
    type: "ip",
    resolution: "720p",
    status: "offline",
  })

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

  const loadCamerasData = async () => {
    setIsLoading(true)
    try {
      const camerasData = await service.getCameras()
      setCameras(camerasData)
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

  const handleAddCamera = async () => {
    try {
      await service.createCamera(newCamera)
      setIsAddCameraDialogOpen(false)
      setNewCamera({
        name: "",
        location: "",
        url: "",
        type: "ip",
        resolution: "720p",
        status: "offline",
      })
      await loadCamerasData()
    } catch (error) {
      console.error("Error adding camera:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading cameras...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cameras</h2>
          <p className="text-muted-foreground">Manage cameras in the ESTIN Entry Detection System</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isAddCameraDialogOpen} onOpenChange={setIsAddCameraDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Camera
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Camera</DialogTitle>
                <DialogDescription>
                  Add a new camera to the system. You can use IP cameras, RTSP streams, or webcams.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Camera Name</Label>
                  <Input
                    id="name"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                    placeholder="Main Entrance"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newCamera.location}
                    onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                    placeholder="Building A, Front Door"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Camera URL</Label>
                  <Input
                    id="url"
                    value={newCamera.url}
                    onChange={(e) => setNewCamera({ ...newCamera, url: e.target.value })}
                    placeholder="rtsp://username:password@192.168.1.100:554/stream1"
                  />
                  <p className="text-xs text-muted-foreground">
                    For IP cameras, use RTSP URL. For webcams, use 0 for default camera.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Camera Type</Label>
                    <Select
                      value={newCamera.type}
                      onValueChange={(value) => setNewCamera({ ...newCamera, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ip">IP Camera</SelectItem>
                        <SelectItem value="webcam">Webcam</SelectItem>
                        <SelectItem value="rtsp">RTSP Stream</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resolution">Resolution</Label>
                    <Select
                      value={newCamera.resolution}
                      onValueChange={(value) => setNewCamera({ ...newCamera, resolution: value })}
                    >
                      <SelectTrigger id="resolution">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="1080p">1080p</SelectItem>
                        <SelectItem value="4k">4K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCameraDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCamera}>Add Camera</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[250px] w-full" />
            ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cameras.length === 0 ? (
            <div className="col-span-full flex h-[300px] items-center justify-center border rounded-md">
              <div className="text-center">
                <CameraIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-lg font-medium">No cameras found</p>
                <p className="text-sm text-muted-foreground mt-1">Add a camera to get started</p>
                <Button className="mt-4" onClick={() => setIsAddCameraDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Camera
                </Button>
              </div>
            </div>
          ) : (
            cameras.map((camera) => (
              <Card key={camera.id}>
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
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <CameraIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to view live feed</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{camera.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Resolution</p>
                      <p className="font-medium">{camera.resolution}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Active</p>
                      <p className="font-medium">{camera.last_active || "Never"}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                  {camera.status === "online" ? (
                    <Button variant="outline" size="sm">
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
