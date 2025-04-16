"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Save, Key, Shield, History } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface UserProfile {
  username: string
  email: string
  fullName: string
  role: string
  lastLogin: string
  createdAt: string
}

export default function ProfilePage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Load profile data
  useEffect(() => {
    if (isAuthenticated) {
      loadProfileData()
    }
  }, [isAuthenticated])

  const loadProfileData = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would fetch this from the backend
      // For now, we'll use sample data
      const sampleProfile: UserProfile = {
        username: user?.username || "admin",
        email: "admin@estin.dz",
        fullName: "Administrator",
        role: "Administrator",
        lastLogin: new Date().toISOString(),
        createdAt: "2023-01-01T00:00:00Z",
      }
      setProfile(sampleProfile)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    setIsSaving(true)
    try {
      // In a real app, you would send this to the backend
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // In a real app, you would send this to the backend
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      })

      // Clear password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Error changing password",
        description: "There was an error changing your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt={profile?.username} />
                  <AvatarFallback className="text-lg">{profile?.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{profile?.fullName}</CardTitle>
                  <CardDescription>{profile?.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={profile?.username || ""} readOnly className="bg-muted" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  onChange={(e) => setProfile(profile ? { ...profile, email: e.target.value } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile?.fullName || ""}
                  onChange={(e) => setProfile(profile ? { ...profile, fullName: e.target.value } : null)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="md:col-span-4 space-y-4">
            <Tabs defaultValue="password" className="w-full">
              <TabsList>
                <TabsTrigger value="password">
                  <Key className="mr-2 h-4 w-4" />
                  Password
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <History className="mr-2 h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleChangePassword} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Two-Factor Authentication</Label>
                      <Button variant="outline">Enable Two-Factor Authentication</Button>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account by requiring a verification code
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Session Management</Label>
                      <Button variant="outline">Manage Active Sessions</Button>
                      <p className="text-sm text-muted-foreground">
                        View and manage your active sessions across different devices
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Activity</CardTitle>
                    <CardDescription>View your recent account activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-2">
                        <p className="font-medium">Last Login</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profile?.lastLogin || "").toLocaleString()}
                        </p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="font-medium">Account Created</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profile?.createdAt || "").toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Recent Activity</p>
                        <ul className="mt-2 space-y-2">
                          <li className="text-sm">
                            <span className="text-muted-foreground">
                              {new Date().toLocaleString()} - Password changed
                            </span>
                          </li>
                          <li className="text-sm">
                            <span className="text-muted-foreground">
                              {new Date(Date.now() - 86400000).toLocaleString()} - Profile updated
                            </span>
                          </li>
                          <li className="text-sm">
                            <span className="text-muted-foreground">
                              {new Date(Date.now() - 172800000).toLocaleString()} - Login from new device
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
