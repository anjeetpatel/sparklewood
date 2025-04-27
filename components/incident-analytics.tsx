"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { Incident } from "@/lib/types"

interface IncidentAnalyticsProps {
  incidents: Incident[]
  isLoading: boolean
}

export default function IncidentAnalytics({ incidents, isLoading }: IncidentAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("trends")

  // Skip analytics if loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  // Prepare data for charts
  const severityData = [
    { name: "High", value: incidents.filter((i) => i.severity === "High").length },
    { name: "Medium", value: incidents.filter((i) => i.severity === "Medium").length },
    { name: "Low", value: incidents.filter((i) => i.severity === "Low").length },
  ]

  const statusData = [
    { name: "New", value: incidents.filter((i) => i.status === "New").length },
    { name: "In Review", value: incidents.filter((i) => i.status === "In Review").length },
    { name: "Resolved", value: incidents.filter((i) => i.status === "Resolved").length },
  ]

  // Group by category
  const categoryMap = new Map<string, number>()
  incidents.forEach((incident) => {
    const category = incident.category || "Uncategorized"
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })

  const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }))

  // Group by month for trend data
  const monthMap = new Map<string, { total: number; high: number; medium: number; low: number }>()

  incidents.forEach((incident) => {
    const date = new Date(incident.reported_at)
    const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

    if (!monthMap.has(monthYear)) {
      monthMap.set(monthYear, { total: 0, high: 0, medium: 0, low: 0 })
    }

    const monthData = monthMap.get(monthYear)!
    monthData.total += 1

    if (incident.severity === "High") monthData.high += 1
    else if (incident.severity === "Medium") monthData.medium += 1
    else if (incident.severity === "Low") monthData.low += 1
  })

  const trendData = Array.from(monthMap.entries())
    .map(([name, data]) => ({
      name,
      Total: data.total,
      High: data.high,
      Medium: data.medium,
      Low: data.low,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.name)
      const dateB = new Date(b.name)
      return dateA.getTime() - dateB.getTime()
    })

  // Colors for charts
  const COLORS = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
    New: "#8b5cf6",
    "In Review": "#3b82f6",
    Resolved: "#10b981",
  }

  const SEVERITY_COLORS = ["#ef4444", "#f59e0b", "#10b981"]
  const STATUS_COLORS = ["#8b5cf6", "#3b82f6", "#10b981"]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="severity">Severity</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Incident Trends Over Time</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Total" stroke="#64748b" strokeWidth={2} />
                    <Line type="monotone" dataKey="High" stroke="#ef4444" />
                    <Line type="monotone" dataKey="Medium" stroke="#f59e0b" />
                    <Line type="monotone" dataKey="Low" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="severity" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Incidents by Severity</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Severity Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count">
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Incidents by Status</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Incidents by Category</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">AI Safety Insights</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Based on the data,{" "}
          {severityData[0].value > severityData[2].value
            ? "high severity incidents are more common than low severity ones. Consider allocating more resources to prevention."
            : "low severity incidents are more common. This suggests your safety measures are working effectively."}{" "}
          {statusData[2].value > statusData[0].value + statusData[1].value
            ? "Most incidents have been resolved, indicating effective response procedures."
            : "There are still several unresolved incidents that require attention."}
        </p>
      </div>
    </div>
  )
}
