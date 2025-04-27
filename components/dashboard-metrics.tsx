"use client"

import { AlertOctagon, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Incident } from "@/lib/types"

interface DashboardMetricsProps {
  incidents: Incident[]
  isLoading: boolean
}

export default function DashboardMetrics({ incidents, isLoading }: DashboardMetricsProps) {
  // Calculate metrics
  const totalIncidents = incidents.length
  const highSeverity = incidents.filter((i) => i.severity === "High").length
  const mediumSeverity = incidents.filter((i) => i.severity === "Medium").length
  const lowSeverity = incidents.filter((i) => i.severity === "Low").length

  const newIncidents = incidents.filter((i) => i.status === "New").length
  const inReviewIncidents = incidents.filter((i) => i.status === "In Review").length
  const resolvedIncidents = incidents.filter((i) => i.status === "Resolved").length

  // Calculate trend (simplified example)
  const lastWeekIncidents = 8 // This would normally be calculated from actual data
  const trend =
    totalIncidents > lastWeekIncidents
      ? { direction: "up", percent: Math.round(((totalIncidents - lastWeekIncidents) / lastWeekIncidents) * 100) }
      : { direction: "down", percent: Math.round(((lastWeekIncidents - totalIncidents) / lastWeekIncidents) * 100) }

  const metrics = [
    {
      title: "Total Incidents",
      value: totalIncidents,
      icon: AlertTriangle,
      trend: trend,
      color: "blue",
    },
    {
      title: "High Severity",
      value: highSeverity,
      icon: AlertOctagon,
      color: "red",
    },
    {
      title: "Medium Severity",
      value: mediumSeverity,
      icon: AlertTriangle,
      color: "amber",
    },
    {
      title: "Low Severity",
      value: lowSeverity,
      icon: AlertCircle,
      color: "green",
    },
    {
      title: "New",
      value: newIncidents,
      icon: Clock,
      color: "purple",
    },
    {
      title: "In Review",
      value: inReviewIncidents,
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Resolved",
      value: resolvedIncidents,
      icon: CheckCircle2,
      color: "green",
    },
  ]

  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
      case "amber":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
      case "green":
        return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      case "blue":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      case "purple":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="overflow-hidden border">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                  </div>
                  <div className={`p-2 rounded-full ${getColorClass(metric.color)}`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                </div>

                {metric.trend && (
                  <div className="mt-3 flex items-center text-sm">
                    {metric.trend.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={metric.trend.direction === "up" ? "text-red-500" : "text-green-500"}>
                      {metric.trend.percent}% {metric.trend.direction === "up" ? "increase" : "decrease"}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1">from last week</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
