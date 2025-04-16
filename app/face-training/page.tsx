"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useBackendService, type Person } from "@/components/backend-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Upload, Camera, ImageIcon, Check, X, Trash2, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function FaceTrainingPage() {
  const { isAuthenticated, loading } = useAuth()
  const { service } = useBackendService()
  const router = useRouter()

  const [people, setPeople] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [captureMode, setCaptureMode] = useState<"upload" | "camera">("upload")
  const [trainingImages, setTrainingImages] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Load people data
  useEffect(() => {
    if (isAuthenticated) {
      loadPeopleData()
    }
  }, [isAuthenticated])

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  const loadPeopleData = async () => {
    setIsLoading(true)
    try {
      const peopleData = await service.getPeople()
      setPeople(peopleData)
    } catch (error) {
      console.error("Error loading people data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePersonChange = (personId: string) => {
    const person = people.find((p) => p.id.toString() === personId)
    setSelectedPerson(person || null)
    // Reset training images when person changes
    setTrainingImages([])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Process each file
    const newImages: string[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result.toString())

          // If all files are processed
          if (newImages.length === files.length) {
            setTrainingImages((prev) => [...prev, ...newImages])
            setIsUploading(false)
            clearInterval(interval)
            setUploadProgress(100)

            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }

            toast({
              title: "Images uploaded",
              description: `${files.length} image(s) uploaded successfully.`,
            })
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const toggleCamera = async () => {
    if (cameraActive) {
      // Stop camera
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
        setCameraStream(null)
      }
      setCameraActive(false)
    } else {
      // Start camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setCameraStream(stream)

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setCameraActive(true)
      } catch (error) {
        console.error("Error accessing camera:", error)
        toast({
          title: "Camera error",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive",
        })
      }
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg")

    // Add to training images
    setTrainingImages((prev) => [...prev, imageDataUrl])

    toast({
      title: "Image captured",
      description: "Face image captured successfully.",
    })
  }

  const removeImage = (index: number) => {
    setTrainingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTrainFaceModel = async () => {
    if (!selectedPerson || trainingImages.length === 0) {
      toast({
        title: "Missing data",
        description: "Please select a person and upload at least one image.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate training progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 300)

    try {
      // In a real app, you would send the images to the backend for training
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(interval)
      setUploadProgress(100)
      setIsUploading(false)

      toast({
        title: "Training complete",
        description: `Face model for ${selectedPerson.name} has been trained successfully.`,
      })

      // Clear training images after successful training
      setTrainingImages([])
    } catch (error) {
      console.error("Error training face model:", error)
      clearInterval(interval)
      setIsUploading(false)

      toast({
        title: "Training error",
        description: "There was an error training the face model. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Face Recognition Training</h2>
          <p className="text-muted-foreground">Train the face recognition system to identify people</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Person</CardTitle>
            <CardDescription>Choose a person to train the face recognition model</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="person">Person</Label>
                  <Select onValueChange={handlePersonChange} value={selectedPerson?.id.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a person" />
                    </SelectTrigger>
                    <SelectContent>
                      {people.map((person) => (
                        <SelectItem key={person.id} value={person.id.toString()}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPerson && (
                  <div className="flex items-center gap-4 p-4 border rounded-md">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/api/people/${selectedPerson.id}/avatar`} alt={selectedPerson.name} />
                      <AvatarFallback>
                        {selectedPerson.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedPerson.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedPerson.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">{selectedPerson.role}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Face Images</CardTitle>
            <CardDescription>Upload or capture images for face recognition training</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={captureMode === "upload" ? "default" : "outline"}
                  onClick={() => setCaptureMode("upload")}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </Button>
                <Button
                  variant={captureMode === "camera" ? "default" : "outline"}
                  onClick={() => setCaptureMode("camera")}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Use Camera
                </Button>
              </div>

              {captureMode === "upload" ? (
                <div className="grid gap-2">
                  <Label htmlFor="images">Upload Face Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    ref={fileInputRef}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload clear images of the person's face. Multiple images improve recognition accuracy.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    {cameraActive ? (
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={toggleCamera} className="flex-1">
                      {cameraActive ? (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Stop Camera
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Start Camera
                        </>
                      )}
                    </Button>
                    {cameraActive && (
                      <Button onClick={captureImage} className="flex-1">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Capture
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-center text-muted-foreground">
                    {uploadProgress < 100 ? "Processing..." : "Complete"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Images</CardTitle>
          <CardDescription>
            {trainingImages.length === 0
              ? "No images added yet"
              : `${trainingImages.length} image(s) ready for training`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trainingImages.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center border rounded-md">
              <div className="text-center">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-lg font-medium">No images added</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload or capture images to train the face recognition model
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trainingImages.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Training ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div
                className="flex items-center justify-center aspect-square rounded-md border border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => (captureMode === "upload" ? fileInputRef.current?.click() : setCaptureMode("camera"))}
              >
                <div className="text-center p-4">
                  <Plus className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Add more</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleTrainFaceModel}
            disabled={!selectedPerson || trainingImages.length === 0 || isUploading}
            className="ml-auto"
          >
            {isUploading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Train Face Model
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
