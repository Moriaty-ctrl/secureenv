import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCheck, UserX } from "lucide-react"
import type { VisitorLog } from "@/components/backend-service"

interface RecentVisitorsTableProps {
  visitors: VisitorLog[]
}

export function RecentVisitorsTable({ visitors }: RecentVisitorsTableProps) {
  if (!visitors || visitors.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center border rounded-md">
        <p className="text-sm text-muted-foreground">No recent visitors</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Person</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visitors.map((visitor) => (
          <TableRow key={visitor.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/api/people/${visitor.person_id}/avatar`} alt={visitor.name} />
                  <AvatarFallback>
                    {visitor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{visitor.name}</span>
              </div>
            </TableCell>
            <TableCell>{visitor.time}</TableCell>
            <TableCell>{visitor.location}</TableCell>
            <TableCell>
              {visitor.status === "verified" ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                >
                  <UserCheck className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                >
                  <UserX className="h-3 w-3" />
                  Unknown
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
