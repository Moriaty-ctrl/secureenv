"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useBackendService, type Settings } from "@/components/backend-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RefreshCw, Save, SettingsIcon, Bell, Shield, Database, Mail } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { isAuthenticated, loading } = useAuth()
  const { service } = useBackendService()
  const router = useRouter()

  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Load settings data
  useEffect(() => {
    if (isAuthenticated) {
      loadSettingsData()
    }
  }, [isAuthenticated])

  const loadSettingsData = async () => {
    setIsLoading(true)
    try {
      const settingsData = await service.getSettings()
      setSettings(settingsData)
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      await service.updateSettings(settings)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error saving settings",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof Settings, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Configure the ESTIN Entry Detection System</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading || isSaving}>
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
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
        </div>
      ) : (
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <SettingsIcon className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="detection">
              <Shield className="mr-2 h-4 w-4" />
              Detection
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="mr-2 h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="system_name">System Name</Label>
                  <Input
                    id="system_name"
                    value={settings?.system_name || ""}
                    onChange={(e) => updateSetting("system_name", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={settings?.institution || ""}
                    onChange={(e) => updateSetting("institution", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={settings?.timezone || ""}
                    onChange={(e) => updateSetting("timezone", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detection Settings</CardTitle>
                <CardDescription>Configure face detection and recognition settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="detection_threshold">Detection Threshold ({settings?.detection_threshold}%)</Label>
                  </div>
                  <Slider
                    id="detection_threshold"
                    min={50}
                    max={95}
                    step={1}
                    value={[settings?.detection_threshold || 60]}
                    onValueChange={(value) => updateSetting("detection_threshold", value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level required to detect a face (50-95%)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recognition_threshold">
                      Recognition Threshold ({settings?.recognition_threshold}%)
                    </Label>
                  </div>
                  <Slider
                    id="recognition_threshold"
                    min={70}
                    max={99}
                    step={1}
                    value={[settings?.recognition_threshold || 80]}
                    onValueChange={(value) => updateSetting("recognition_threshold", value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level required to recognize a face (70-99%)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="save_unknown_faces"
                    checked={settings?.save_unknown_faces || false}
                    onCheckedChange={(checked) => updateSetting("save_unknown_faces", checked)}
                  />
                  <Label htmlFor="save_unknown_faces">Save Unknown Faces</Label>
                </div>
                <p className="text-xs text-muted-foreground">Save images of unrecognized faces for later review</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="real_time_alerts"
                    checked={settings?.real_time_alerts || false}
                    onCheckedChange={(checked) => updateSetting("real_time_alerts", checked)}
                  />
                  <Label htmlFor="real_time_alerts">Real-time Alerts</Label>
                </div>
                <p className="text-xs text-muted-foreground">Show real-time alerts in the dashboard</p>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="email_notifications"
                    checked={settings?.email_notifications || false}
                    onCheckedChange={(checked) => updateSetting("email_notifications", checked)}
                  />
                  <Label htmlFor="email_notifications">Email Notifications</Label>
                </div>

                {settings?.email_notifications && (
                  <div className="grid gap-2 pl-6">
                    <Label htmlFor="email_address">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email_address"
                        value={settings?.email_address || ""}
                        onChange={(e) => updateSetting("email_address", e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="unknown_alerts"
                    checked={settings?.unknown_alerts || false}
                    onCheckedChange={(checked) => updateSetting("unknown_alerts", checked)}
                  />
                  <Label htmlFor="unknown_alerts">Unknown Visitor Alerts</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="system_alerts"
                    checked={settings?.system_alerts || false}
                    onCheckedChange={(checked) => updateSetting("system_alerts", checked)}
                  />
                  <Label htmlFor="system_alerts">System Issue Alerts</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system security and data settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={settings?.session_timeout || 30}
                    onChange={(e) => updateSetting("session_timeout", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="two_factor_auth"
                    checked={settings?.two_factor_auth || false}
                    onCheckedChange={(checked) => updateSetting("two_factor_auth", checked)}
                  />
                  <Label htmlFor="two_factor_auth">Two-Factor Authentication</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="audit_logs"
                    checked={settings?.audit_logs || false}
                    onCheckedChange={(checked) => updateSetting("audit_logs", checked)}
                  />
                  <Label htmlFor="audit_logs">Enable Audit Logs</Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="log_retention">Log Retention (days)</Label>
                  <Input
                    id="log_retention"
                    type="number"
                    value={settings?.log_retention || 30}
                    onChange={(e) => updateSetting("log_retention", Number.parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
