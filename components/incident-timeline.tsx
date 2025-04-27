"use client"

import { AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { Incident } from "@/lib/types"

interface IncidentTimelineProps {
  incidents: Incident[]
  isLoading: boolean
}

export default function IncidentTimeline({ incidents, isLoading }: IncidentTimelineProps) {
  // Sort incidents by date
  const sortedIncidents = [...incidents].sort((a, b) => {
    return new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
  })

  // Group incidents by month
  const groupedIncidents: Record<string, Incident[]> = {}

  sortedIncidents.forEach((incident) => {
    const date = new Date(incident.reported_at)
    const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    if (!groupedIncidents[monthYear]) {
      groupedIncidents[monthYear] = []
    }

    groupedIncidents[monthYear].push(incident)
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return <AlertCircle className="h-5 w-5 text-green-500" />
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "High":
        return <AlertOctagon className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((month) => (
          <div key={month} className="space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <div className="space-y-4 ml-6 border-l-2 border-slate-200 dark:border-slate-700 pl-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (Object.keys(groupedIncidents).length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="size-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">No incidents found</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          There are no incidents to display in the timeline.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedIncidents).map(([monthYear, incidents]) => (
        <div key={monthYear} className="space-y-4">
          <h3 className="font-medium text-lg text-slate-900 dark:text-slate-200">{monthYear}</h3>

          <div className="space-y-6 ml-6 border-l-2 border-slate-200 dark:border-slate-700 pl-6">
            {incidents.map((incident) => (
              <div key={incident.id} className="relative">
                <div className="absolute -left-[42px] size-6 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700" />

                <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-lg border shadow-sm">
                  <div className="mt-1">{getSeverityIcon(incident.severity)}</div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{incident.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {formatDate(incident.reported_at)}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {incident.description}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <Badge
                        className={
                          incident.severity === "Low"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : incident.severity === "Medium"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }
                      >
                        {incident.severity}
                      </Badge>

                      {incident.category && <Badge variant="outline">{incident.category}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
