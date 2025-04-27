"use client"

import { useState } from "react"
import {
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  RotateCcw,
} from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Incident } from "@/lib/types"

interface IncidentListProps {
  incidents: Incident[]
  isLoading?: boolean
  onUpdateStatus?: (id: number, status: string) => void
  compact?: boolean
}

export default function IncidentList({
  incidents,
  isLoading = false,
  onUpdateStatus,
  compact = false,
}: IncidentListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const toggleExpand = (id: number) => {
    const newExpandedIds = new Set(expandedIds)
    if (expandedIds.has(id)) {
      newExpandedIds.delete(id)
    } else {
      newExpandedIds.add(id)
    }
    setExpandedIds(newExpandedIds)
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <Clock className="h-4 w-4" />
      case "In Review":
        return <RotateCcw className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return null
    }
  }

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return ""
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "New":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "In Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return ""
    }
  }

  const getCategoryClass = (category: string) => {
    switch (category) {
      case "Bias":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "Hallucination":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      case "Data Leak":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Performance":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-5 w-[250px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-[100px] rounded-full" />
                    <Skeleton className="h-5 w-[100px] rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (incidents.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="size-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">No incidents found</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Try changing your filters or report a new incident.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <Card
          key={incident.id}
          className={`transition-all duration-200 ${
            incident.severity === "High" ? "border-red-200 dark:border-red-800 shadow-sm" : ""
          } ${compact ? "p-0" : ""}`}
        >
          <CardContent className={compact ? "p-4" : "pt-6 px-6"}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {getSeverityIcon(incident.severity)}
                <div className="min-w-0">
                  <h3 className="font-medium text-lg truncate">{incident.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getSeverityClass(incident.severity)}>{incident.severity}</Badge>

                    <Badge className={getStatusClass(incident.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(incident.status)}
                        {incident.status}
                      </span>
                    </Badge>

                    {incident.category && (
                      <Badge className={getCategoryClass(incident.category)}>{incident.category}</Badge>
                    )}

                    <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                      {formatDate(incident.reported_at)}
                    </Badge>
                  </div>
                </div>
              </div>

              {onUpdateStatus && (
                <TooltipProvider>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Actions</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(incident.id, "New")}
                        disabled={incident.status === "New"}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Mark as New</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(incident.id, "In Review")}
                        disabled={incident.status === "In Review"}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        <span>Mark as In Review</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(incident.id, "Resolved")}
                        disabled={incident.status === "Resolved"}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <span>Mark as Resolved</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipProvider>
              )}
            </div>

            {expandedIds.has(incident.id) && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-md text-slate-700 dark:text-slate-300 animate-in fade-in duration-200">
                {incident.description}

                {incident.steps_to_reproduce && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-slate-200 mb-2">Steps to Reproduce:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      {incident.steps_to_reproduce.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {incident.assigned_to && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Assigned to:</span>
                    <Badge variant="outline">{incident.assigned_to}</Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {!compact && (
            <CardFooter className="pb-4 pt-0 px-6 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(incident.id)}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {expandedIds.has(incident.id) ? (
                  <>
                    <ChevronUp className="mr-1 h-4 w-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-4 w-4" />
                    View Details
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
