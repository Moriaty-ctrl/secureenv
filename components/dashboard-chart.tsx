"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTheme } from "next-themes"

const data = [
  { time: "6:00", estin: 4, unknown: 1 },
  { time: "7:00", estin: 12, unknown: 2 },
  { time: "8:00", estin: 30, unknown: 3 },
  { time: "9:00", estin: 22, unknown: 1 },
  { time: "10:00", estin: 15, unknown: 0 },
  { time: "11:00", estin: 10, unknown: 1 },
  { time: "12:00", estin: 18, unknown: 2 },
  { time: "13:00", estin: 24, unknown: 1 },
  { time: "14:00", estin: 16, unknown: 1 },
  { time: "15:00", estin: 12, unknown: 0 },
  { time: "16:00", estin: 8, unknown: 1 },
  { time: "17:00", estin: 14, unknown: 1 },
]

export function DashboardChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="time" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              color: textColor,
              border: `1px solid ${gridColor}`,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="estin"
            name="ESTIN Members"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line type="monotone" dataKey="unknown" name="Unknown Visitors" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
