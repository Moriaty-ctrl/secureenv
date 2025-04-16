"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface WebSocketContextType {
  connected: boolean
  lastMessage: any | null
  sendMessage: (message: any) => void
  addEventListener: (event: string, callback: (data: any) => void) => void
  removeEventListener: (event: string, callback: (data: any) => void) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

interface WebSocketProviderProps {
  url: string
  children: ReactNode
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [connected, setConnected] = useState<boolean>(false)
  const [lastMessage, setLastMessage] = useState<any | null>(null)
  const [eventListeners, setEventListeners] = useState<{ [key: string]: ((data: any) => void)[] }>({})

  // Connect to WebSocket
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    const ws = new WebSocket(url)

    ws.onopen = () => {
      console.log("WebSocket connected")
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)

        // Trigger event listeners
        if (data.type && eventListeners[data.type]) {
          eventListeners[data.type].forEach((listener) => listener(data))
        }

        // Trigger 'all' event listeners
        if (eventListeners["all"]) {
          eventListeners["all"].forEach((listener) => listener(data))
        }
      } catch (error) {
        console.error("WebSocket message error:", error)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setConnected(false)

      // Try to reconnect after 5 seconds
      setTimeout(() => {
        setSocket(new WebSocket(url))
      }, 5000)
    }

    setSocket(ws)

    // Cleanup on unmount
    return () => {
      ws.close()
    }
  }, [url])

  // Send message
  const sendMessage = (message: any) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message))
    } else {
      console.error("WebSocket not connected")
    }
  }

  // Add event listener
  const addEventListener = (event: string, callback: (data: any) => void) => {
    setEventListeners((prev) => {
      const newListeners = { ...prev }
      if (!newListeners[event]) {
        newListeners[event] = []
      }
      newListeners[event].push(callback)
      return newListeners
    })
  }

  // Remove event listener
  const removeEventListener = (event: string, callback: (data: any) => void) => {
    setEventListeners((prev) => {
      const newListeners = { ...prev }
      if (newListeners[event]) {
        newListeners[event] = newListeners[event].filter((listener) => listener !== callback)
      }
      return newListeners
    })
  }

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        lastMessage,
        sendMessage,
        addEventListener,
        removeEventListener,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
