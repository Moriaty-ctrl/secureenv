import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CameraGrid } from "@/components/camera-grid"
import { CameraFeed } from "@/components/camera-feed"
import { Camera, Grid3X3, Maximize2, RefreshCw } from "lucide-react"

export default function LiveFeeds() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Camera Feeds</h1>
          <p className="text-muted-foreground">Monitor all entry points in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Camera className="h-3 w-3" />6 Active Cameras
          </Badge>
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh All
          </Button>
          <Button size="sm" variant="outline">
            <Grid3X3 className="mr-2 h-4 w-4" />
            Grid View
          </Button>
          <Button size="sm">
            <Maximize2 className="mr-2 h-4 w-4" />
            Fullscreen
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="main">Main Entrance</TabsTrigger>
          <TabsTrigger value="side">Side Entrance</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="cafeteria">Cafeteria</TabsTrigger>
          <TabsTrigger value="parking">Parking</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="space-y-6">
          <CameraGrid />
        </TabsContent>
        <TabsContent value="main" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Entrance</CardTitle>
              <CardDescription>Primary entry point to the campus</CardDescription>
            </CardHeader>
            <CardContent>
              <CameraFeed id="main-entrance" name="Main Entrance" height={600} showControls={true} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="side" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Side Entrance</CardTitle>
              <CardDescription>Secondary entry point near the administration building</CardDescription>
            </CardHeader>
            <CardContent>
              <CameraFeed id="side-entrance" name="Side Entrance" height={600} showControls={true} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Library Entrance</CardTitle>
              <CardDescription>Entry to the main library building</CardDescription>
            </CardHeader>
            <CardContent>
              <CameraFeed id="library-entrance" name="Library Entrance" height={600} showControls={true} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cafeteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cafeteria Entrance</CardTitle>
              <CardDescription>Entry to the campus cafeteria</CardDescription>
            </CardHeader>
            <CardContent>
              <CameraFeed id="cafeteria-entrance" name="Cafeteria Entrance" height={600} showControls={true} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="parking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parking Entrance</CardTitle>
              <CardDescription>Vehicle entry point to campus parking</CardDescription>
            </CardHeader>
            <CardContent>
              <CameraFeed id="parking-entrance" name="Parking Entrance" height={600} showControls={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
