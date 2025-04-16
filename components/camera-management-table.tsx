import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Settings, Eye } from "lucide-react"

const cameras = [
  {
    id: 1,
    name: "Main Entrance",
    location: "Front Gate",
    type: "IP Camera",
    resolution: "1080p",
    status: "online",
    lastActive: "Just now",
    url: "rtsp://192.168.1.101:554/stream",
  },
  {
    id: 2,
    name: "Side Entrance",
    location: "East Wing",
    type: "IP Camera",
    resolution: "1080p",
    status: "online",
    lastActive: "Just now",
    url: "rtsp://192.168.1.102:554/stream",
  },
  {
    id: 3,
    name: "Library Entrance",
    location: "Library Building",
    type: "IP Camera",
    resolution: "1080p",
    status: "online",
    lastActive: "Just now",
    url: "rtsp://192.168.1.103:554/stream",
  },
  {
    id: 4,
    name: "Cafeteria Entrance",
    location: "Cafeteria Building",
    type: "IP Camera",
    resolution: "720p",
    status: "offline",
    lastActive: "3 hours ago",
    url: "rtsp://192.168.1.104:554/stream",
  },
  {
    id: 5,
    name: "Parking Entrance",
    location: "Parking Lot",
    type: "IP Camera",
    resolution: "1080p",
    status: "online",
    lastActive: "Just now",
    url: "rtsp://192.168.1.105:554/stream",
  },
  {
    id: 6,
    name: "Admin Building",
    location: "Administration",
    type: "IP Camera",
    resolution: "1080p",
    status: "online",
    lastActive: "Just now",
    url: "rtsp://192.168.1.106:554/stream",
  },
]

export function CameraManagementTable() {
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Resolution</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Active</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((camera) => (
              <tr key={camera.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium">{camera.name}</td>
                <td className="p-4 align-middle">{camera.location}</td>
                <td className="p-4 align-middle">{camera.type}</td>
                <td className="p-4 align-middle">{camera.resolution}</td>
                <td className="p-4 align-middle">
                  <Badge
                    variant={camera.status === "online" ? "outline" : "secondary"}
                    className={
                      camera.status === "online"
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                        : ""
                    }
                  >
                    {camera.status === "online" ? "Online" : "Offline"}
                  </Badge>
                </td>
                <td className="p-4 align-middle">
                  <Switch checked={camera.status === "online"} aria-label="Toggle camera" />
                </td>
                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Feed
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500 focus:text-red-500">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
