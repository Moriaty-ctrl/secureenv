import { CameraFeed } from "@/components/camera-feed"

const cameras = [
  { id: "main-entrance", name: "Main Entrance" },
  { id: "side-entrance", name: "Side Entrance" },
  { id: "library-entrance", name: "Library Entrance" },
  { id: "cafeteria-entrance", name: "Cafeteria Entrance" },
  { id: "parking-entrance", name: "Parking Entrance" },
  { id: "admin-entrance", name: "Admin Building" },
]

export function CameraGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <CameraFeed key={camera.id} id={camera.id} name={camera.name} height={240} />
      ))}
    </div>
  )
}
