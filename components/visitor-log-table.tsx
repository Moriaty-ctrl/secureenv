import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, AlertCircle, MoreHorizontal, Eye, UserPlus, Flag } from "lucide-react"

interface VisitorLogTableProps {
  status?: "verified" | "unknown"
}

const visitorLogs = [
  {
    id: 1,
    name: "Ahmed Benali",
    time: "09:42 AM",
    date: "2025-04-16",
    location: "Main Entrance",
    status: "verified",
    image: "/placeholder.svg?height=40&width=40",
    role: "Student",
    confidence: 98.2,
  },
  {
    id: 2,
    name: "Sarah Mansouri",
    time: "09:38 AM",
    date: "2025-04-16",
    location: "Library Entrance",
    status: "verified",
    image: "/placeholder.svg?height=40&width=40",
    role: "Teacher",
    confidence: 97.5,
  },
  {
    id: 3,
    name: "Unknown Visitor",
    time: "09:35 AM",
    date: "2025-04-16",
    location: "Main Entrance",
    status: "unknown",
    image: "/placeholder.svg?height=40&width=40",
    role: null,
    confidence: 0,
  },
  {
    id: 4,
    name: "Karim Hadj",
    time: "09:30 AM",
    date: "2025-04-16",
    location: "Side Entrance",
    status: "verified",
    image: "/placeholder.svg?height=40&width=40",
    role: "Staff",
    confidence: 96.8,
  },
  {
    id: 5,
    name: "Unknown Visitor",
    time: "09:22 AM",
    date: "2025-04-16",
    location: "Main Entrance",
    status: "unknown",
    image: "/placeholder.svg?height=40&width=40",
    role: null,
    confidence: 0,
  },
  {
    id: 6,
    name: "Leila Bouaziz",
    time: "09:15 AM",
    date: "2025-04-16",
    location: "Library Entrance",
    status: "verified",
    image: "/placeholder.svg?height=40&width=40",
    role: "Student",
    confidence: 95.3,
  },
  {
    id: 7,
    name: "Omar Taleb",
    time: "09:10 AM",
    date: "2025-04-16",
    location: "Side Entrance",
    status: "verified",
    image: "/placeholder.svg?height=40&width=40",
    role: "Teacher",
    confidence: 94.7,
  },
  {
    id: 8,
    name: "Unknown Visitor",
    time: "09:05 AM",
    date: "2025-04-16",
    location: "Cafeteria Entrance",
    status: "unknown",
    image: "/placeholder.svg?height=40&width=40",
    role: null,
    confidence: 0,
  },
  {
    id: 9,
    name: "Amina Kaci",
    time: "09:00 AM",
    date: "2025-04-16",
    location: "Main Entrance",
    status: "verified",
    image: "/placeholder.svg?height=40&width=40",
    role: "Student",
    confidence: 97.1,
  },
  {
    id: 10,
    name: "Youcef Benmoussa",
    time: "08:55 AM",
    date: "2025-04-16",
    location: "Main Entrance",
    status: "verified",
    image: "/placeholder.svg?height=40&width=40",
    role: "Staff",
    confidence: 98.5,
  },
]

export function VisitorLogTable({ status }: VisitorLogTableProps) {
  const filteredLogs = status ? visitorLogs.filter((log) => log.status === status) : visitorLogs

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Person</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Date & Time</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Confidence</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={log.image || "/placeholder.svg"} alt={log.name} />
                      <AvatarFallback>{log.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{log.name}</p>
                      {log.role && <p className="text-xs text-muted-foreground">{log.role}</p>}
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div>
                    <p>{log.date}</p>
                    <p className="text-xs text-muted-foreground">{log.time}</p>
                  </div>
                </td>
                <td className="p-4 align-middle">{log.location}</td>
                <td className="p-4 align-middle">
                  {log.status === "verified" ? (
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Unknown
                    </Badge>
                  )}
                </td>
                <td className="p-4 align-middle">
                  {log.status === "verified" ? <span>{log.confidence.toFixed(1)}%</span> : <span>-</span>}
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
                        View Details
                      </DropdownMenuItem>
                      {log.status === "unknown" && (
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add as New Person
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Report Issue
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
