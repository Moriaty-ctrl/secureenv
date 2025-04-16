"use client"

import { useEffect, useState } from "react"
import { useBackendService } from "@/components/backend-service"
import { Skeleton } from "@/components/ui/skeleton"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ActivityData {
  hour: string
  verified: number
  unknown: number
  total: number
}

export function ActivityChart() {
  const { service } = useBackendService()
  const [data, setData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        // In a real app, you would fetch this data from the backend
        // For now, we'll generate some sample data
        const sampleData = generateSampleData()
        setData(sampleData)
      } catch (error) {
        console.error("Error loading activity data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivityData()
  }, [service])

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  return (
    <ChartContainer className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="hour" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
          <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="font-medium">{label}</div>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">Total: {payload[0].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground">Verified: {payload[1].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-sm text-muted-foreground">Unknown: {payload[2].value}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line type="monotone" dataKey="verified" stroke="hsl(142.1 76.2% 36.3%)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="unknown" stroke="hsl(47.9 95.8% 53.1%)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

function generateSampleData(): ActivityData[] {
  // Generate sample data for a 24-hour period
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0") + ":00"

    // Generate some random data with a peak during working hours
    let multiplier = 1
    if (i >= 8 && i <= 18) {
      multiplier = 3
      if (i >= 9 && i <= 10) multiplier = 5 // Morning peak
      if (i >= 13 && i <= 14) multiplier = 4 // Lunch peak
      if (i >= 16 && i <= 17) multiplier = 5 // Evening peak
    }

    const total = Math.floor(Math.random() * 10 * multiplier) + 1
    const verified = Math.floor(total * 0.7)
    const unknown = total - verified

    return {
      hour,
      total,
      verified,
      unknown,
    }
  })
}
