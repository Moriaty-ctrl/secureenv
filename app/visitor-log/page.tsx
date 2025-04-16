import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VisitorLogTable } from "@/components/visitor-log-table"
import { Download, Search, Calendar, Filter, RefreshCw } from "lucide-react"

export default function VisitorLogPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitor Log</h1>
          <p className="text-muted-foreground">Complete history of all detected entries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search logs..." className="pl-8 w-full" />
        </div>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Entries</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="unknown">Unknown</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6">
          <VisitorLogTable />
        </TabsContent>
        <TabsContent value="verified" className="space-y-6">
          <VisitorLogTable status="verified" />
        </TabsContent>
        <TabsContent value="unknown" className="space-y-6">
          <VisitorLogTable status="unknown" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
