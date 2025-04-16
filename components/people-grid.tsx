import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react"

interface PeopleGridProps {
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
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 2,
    name: "Sarah Mansouri",
    email: "sarah.mansouri@estin.dz",
    role: "Teacher",
    department: "Mathematics",
    status: "active",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 3,
    name: "Karim Hadj",
    email: "karim.hadj@estin.dz",
    role: "Staff",
    department: "Administration",
    status: "active",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 4,
    name: "Leila Bouaziz",
    email: "leila.bouaziz@estin.dz",
    role: "Student",
    department: "Electrical Engineering",
    status: "active",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 5,
    name: "Omar Taleb",
    email: "omar.taleb@estin.dz",
    role: "Teacher",
    department: "Physics",
    status: "inactive",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 6,
    name: "Amina Kaci",
    email: "amina.kaci@estin.dz",
    role: "Student",
    department: "Computer Science",
    status: "active",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 7,
    name: "Youcef Benmoussa",
    email: "youcef.benmoussa@estin.dz",
    role: "Staff",
    department: "Security",
    status: "active",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 8,
    name: "Fatima Zahra",
    email: "fatima.zahra@estin.dz",
    role: "Student",
    department: "Computer Science",
    status: "active",
    image: "/placeholder.svg?height=120&width=120",
  },
]

export function PeopleGrid({ role }: PeopleGridProps) {
  const filteredPeople = role ? people.filter((person) => person.role === role) : people

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredPeople.map((person) => (
        <Card key={person.id}>
          <CardContent className="pt-6 pb-2 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={person.image || "/placeholder.svg"} alt={person.name} />
              <AvatarFallback className="text-2xl">{person.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-lg">{person.name}</h3>
            <p className="text-sm text-muted-foreground">{person.email}</p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role:</span>
                <span>{person.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department:</span>
                <span>{person.department}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Status:</span>
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
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Face Data
            </Button>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
