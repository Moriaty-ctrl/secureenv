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
import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react"

interface PeopleTableProps {
  role?: string
}

const people = [
  {
    id: 1,
    name: "Ahmed Benali",
    email: "ahmed.benali@estin.dz",
    role: "Student",
    department: "Computer Science",
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Sarah Mansouri",
    email: "sarah.mansouri@estin.dz",
    role: "Teacher",
    department: "Mathematics",
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Karim Hadj",
    email: "karim.hadj@estin.dz",
    role: "Staff",
    department: "Administration",
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Leila Bouaziz",
    email: "leila.bouaziz@estin.dz",
    role: "Student",
    department: "Electrical Engineering",
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Omar Taleb",
    email: "omar.taleb@estin.dz",
    role: "Teacher",
    department: "Physics",
    status: "inactive",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Amina Kaci",
    email: "amina.kaci@estin.dz",
    role: "Student",
    department: "Computer Science",
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Youcef Benmoussa",
    email: "youcef.benmoussa@estin.dz",
    role: "Staff",
    department: "Security",
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export function PeopleTable({ role }: PeopleTableProps) {
  const filteredPeople = role ? people.filter((person) => person.role === role) : people

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Department</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map((person) => (
              <tr key={person.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={person.image || "/placeholder.svg"} alt={person.name} />
                      <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{person.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">{person.email}</td>
                <td className="p-4 align-middle">{person.role}</td>
                <td className="p-4 align-middle">{person.department}</td>
                <td className="p-4 align-middle">
                  <Badge
                    variant={person.status === "active" ? "outline" : "secondary"}
                    className={
                      person.status === "active"
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                        : ""
                    }
                  >
                    {person.status === "active" ? "Active" : "Inactive"}
                  </Badge>
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
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Face Data
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
