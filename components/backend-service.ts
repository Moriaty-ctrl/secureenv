"use client"

import { useState } from "react"

// Define types for backend data
export interface Person {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: string
  created_at: string
}

export interface Camera {
  id: number
  name: string
  location: string
  url: string
  type: string
  resolution: string
  status: string
  last_active?: string
}

export interface VisitorLog {
  id: number
  person_id?: number
  name: string
  time: string
  date: string
  location: string
  status: string
  confidence: number
  camera_id: number
  created_at: string
}

export interface Stats {
  total_entries: number
  verified_entries: number
  unknown_entries: number
  peak_entry_time: string
}

export interface Settings {
  id: number
  system_name: string
  institution: string
  timezone: string
  detection_threshold: number
  recognition_threshold: number
  save_unknown_faces: boolean
  real_time_alerts: boolean
  email_notifications: boolean
  email_address: string
  unknown_alerts: boolean
  system_alerts: boolean
  session_timeout: number
  two_factor_auth: boolean
  audit_logs: boolean
  log_retention: number
}

export interface AuthToken {
  access_token: string
  token_type: string
}

// Backend service class
export class BackendService {
  private token: string | null = null
  private backendUrl: string
  private websocket: WebSocket | null = null
  private eventListeners: { [key: string]: ((data: any) => void)[] } = {}

  constructor() {
    this.backendUrl = process.env.BACKEND_URL || "http://localhost:8000"

    // Try to load token from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  // Authentication methods
  async login(username: string, password: string): Promise<boolean> {
    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("password", password)

      const response = await fetch(`${this.backendUrl}/token`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data: AuthToken = await response.json()
        this.token = data.access_token

        // Save token to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", this.token)
        }

        // Connect to WebSocket
        this.connectWebSocket()

        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  logout(): void {
    this.token = null

    // Remove token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }

    // Disconnect WebSocket
    this.disconnectWebSocket()
  }

  isAuthenticated(): boolean {
    return this.token !== null
  }

  // WebSocket methods
  private connectWebSocket(): void {
    if (typeof window === "undefined") return

    const wsUrl = this.backendUrl.replace(/^http/, "ws") + "/ws"
    this.websocket = new WebSocket(wsUrl)

    this.websocket.onopen = () => {
      console.log("WebSocket connected")
    }

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Trigger event listeners
        if (data.type && this.eventListeners[data.type]) {
          this.eventListeners[data.type].forEach((listener) => listener(data))
        }

        // Trigger 'all' event listeners
        if (this.eventListeners["all"]) {
          this.eventListeners["all"].forEach((listener) => listener(data))
        }
      } catch (error) {
        console.error("WebSocket message error:", error)
      }
    }

    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    this.websocket.onclose = () => {
      console.log("WebSocket disconnected")

      // Try to reconnect after 5 seconds
      setTimeout(() => {
        if (this.token) {
          this.connectWebSocket()
        }
      }, 5000)
    }
  }

  private disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  }

  addEventListener(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }

    this.eventListeners[event].push(callback)
  }

  removeEventListener(event: string, callback: (data: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter((listener) => listener !== callback)
    }
  }

  // API methods
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.token) {
      throw new Error("Not authenticated")
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
      ...options.headers,
    }

    const response = await fetch(`${this.backendUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // People API
  async getPeople(skip = 0, limit = 100, role?: string): Promise<Person[]> {
    let endpoint = `/api/people?skip=${skip}&limit=${limit}`
    if (role) {
      endpoint += `&role=${role}`
    }

    return this.fetchApi<Person[]>(endpoint)
  }

  async createPerson(person: Omit<Person, "id" | "created_at">): Promise<Person> {
    return this.fetchApi<Person>("/api/people", {
      method: "POST",
      body: JSON.stringify(person),
    })
  }

  async addFaceData(personId: number, imageFile: File): Promise<any> {
    if (!this.token) {
      throw new Error("Not authenticated")
    }

    const formData = new FormData()
    formData.append("file", imageFile)

    const response = await fetch(`${this.backendUrl}/api/people/${personId}/face`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Visitor logs API
  async getVisitorLogs(skip = 0, limit = 100, status?: string, date?: string): Promise<VisitorLog[]> {
    let endpoint = `/api/visitor-logs?skip=${skip}&limit=${limit}`
    if (status) {
      endpoint += `&status=${status}`
    }
    if (date) {
      endpoint += `&date=${date}`
    }

    return this.fetchApi<VisitorLog[]>(endpoint)
  }

  // Cameras API
  async getCameras(): Promise<Camera[]> {
    return this.fetchApi<Camera[]>("/api/cameras")
  }

  async createCamera(camera: Omit<Camera, "id" | "last_active">): Promise<Camera> {
    return this.fetchApi<Camera>("/api/cameras", {
      method: "POST",
      body: JSON.stringify(camera),
    })
  }

  // Stats API
  async getStats(): Promise<Stats> {
    return this.fetchApi<Stats>("/api/stats")
  }

  // Settings API
  async getSettings(): Promise<Settings> {
    return this.fetchApi<Settings>("/api/settings")
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    return this.fetchApi<Settings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }

  // Process frame API
  async processFrame(cameraId: number, frameBase64: string): Promise<any> {
    return this.fetchApi<any>("/api/process-frame", {
      method: "POST",
      body: JSON.stringify({
        camera_id: cameraId,
        frame: frameBase64,
      }),
    })
  }
}

// React hook for using the backend service
export function useBackendService() {
  const [service] = useState<BackendService>(() => new BackendService())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(service.isAuthenticated())

  // Authentication methods
  const login = async (username: string, password: string): Promise<boolean> => {
    const result = await service.login(username, password)
    setIsAuthenticated(result)
    return result
  }

  const logout = () => {
    service.logout()
    setIsAuthenticated(false)
  }

  return {
    service,
    isAuthenticated,
    login,
    logout,
  }
}
