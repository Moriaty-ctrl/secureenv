"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useBackendService } from "@/components/backend-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Bell, AlertCircle, CheckCircle, Trash2, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: number
  type: "alert" | "info" | "warning"
  title: string
  message: string
  read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth()
  const { service } = useBackendService()
  const router = useRouter()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "alerts">("all")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Load notifications data
  useEffect(() => {
    if (isAuthenticated) {
      loadNotificationsData()
    }
  }, [isAuthenticated])

  const loadNotificationsData = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would fetch this from the backend
      // For now, we'll use sample data
      const sampleNotifications = generateSampleNotifications()
      setNotifications(sampleNotifications)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadNotificationsData()
    setRefreshing(false)
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.read
    if (activeTab === "alerts") return notification.type === "alert"
    return true
  })

  const unreadCount = notifications.filter((notification) => !notification.read).length

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          {unreadCount > 0 && <Badge className="bg-primary text-primary-foreground">{unreadCount}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={markAllAsRead} variant="outline" size="sm" disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[100px] w-full" />
                ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex h-[200px] items-center justify-center">
                <div className="text-center">
                  <Bell className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-medium">No notifications</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === "all"
                      ? "You don't have any notifications"
                      : activeTab === "unread"
                        ? "You don't have any unread notifications"
                        : "You don't have any alerts"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-colors ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <NotificationIcon type={notification.type} />
                      <CardTitle className="text-lg">{notification.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{notification.message}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "alert":
      return <AlertCircle className="h-5 w-5 text-red-500" />
    case "warning":
      return <AlertCircle className="h-5 w-5 text-amber-500" />
    default:
      return <Bell className="h-5 w-5 text-blue-500" />
  }
}

function generateSampleNotifications(): Notification[] {
  const now = new Date()

  return [
    {
      id: 1,
      type: "alert",
      title: "Unknown visitor detected",
      message: "Unknown visitor detected at Main Entrance. Please check the visitor logs.",
      read: false,
      created_at: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 minutes ago
    },
    {
      id: 2,
      type: "warning",
      title: "Camera offline",
      message: "Side Entrance camera is offline. Please check the connection.",
      read: false,
      created_at: new Date(now.getTime() - 30 * 60000).toISOString(), // 30 minutes ago
    },
    {
      id: 3,
      type: "info",
      title: "System update",
      message: "System was updated to version 1.2.0. New features include improved face recognition.",
      read: true,
      created_at: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
    },
    {
      id: 4,
      type: "alert",
      title: "Multiple unknown visitors",
      message: "3 unknown visitors detected at Library Entrance within 5 minutes.",
      read: true,
      created_at: new Date(now.getTime() - 5 * 3600000).toISOString(), // 5 hours ago
    },
    {
      id: 5,
      type: "info",
      title: "New user added",
      message: "New user 'Ahmed Benali' was added to the system.",
      read: true,
      created_at: new Date(now.getTime() - 24 * 3600000).toISOString(), // 1 day ago
    },
  ]
}
