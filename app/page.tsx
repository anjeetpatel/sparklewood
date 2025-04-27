"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Download, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import DashboardHeader from "@/components/dashboard-header"
import IncidentList from "@/components/incident-list"
import ReportIncidentForm from "@/components/report-incident-form"
import FilterSortControls from "@/components/filter-sort-controls"
import DashboardMetrics from "@/components/dashboard-metrics"
import IncidentTimeline from "@/components/incident-timeline"
import IncidentAnalytics from "@/components/incident-analytics"
import KeyboardShortcutsHelp from "@/components/keyboard-shortcuts-help"
import type { Incident } from "@/lib/types"
import { initialIncidents } from "@/lib/data"
import { exportToCSV } from "@/lib/utils"

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [filterSeverity, setFilterSeverity] = useState<string>("All")
  const [filterStatus, setFilterStatus] = useState<string>("All")
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [sortOrder, setSortOrder] = useState<string>("Newest First")
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const { toast } = useToast()

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only apply shortcuts when not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault()
            setShowForm((prev) => !prev)
            break
          case "f":
            e.preventDefault()
            document.querySelector<HTMLInputElement>('input[placeholder="Search incidents..."]')?.focus()
            break
          case "e":
            e.preventDefault()
            handleExportData()
            break
          case "?":
            e.preventDefault()
            setShowKeyboardHelp(true)
            break
          case "1":
            e.preventDefault()
            setActiveTab("dashboard")
            break
          case "2":
            e.preventDefault()
            setActiveTab("incidents")
            break
          case "3":
            e.preventDefault()
            setActiveTab("timeline")
            break
          case "4":
            e.preventDefault()
            setActiveTab("analytics")
            break
        }
      } else if (e.key === "?") {
        setShowKeyboardHelp(true)
      } else if (e.key === "Escape" && showKeyboardHelp) {
        setShowKeyboardHelp(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showKeyboardHelp])

  const handleAddIncident = (newIncident: Omit<Incident, "id" | "reported_at">) => {
    const incident: Incident = {
      ...newIncident,
      id: Math.max(0, ...incidents.map((i) => i.id)) + 1,
      reported_at: new Date().toISOString(),
      status: "New",
    }

    setIncidents([incident, ...incidents])
    setShowForm(false)

    toast({
      title: "Incident Reported",
      description: "The new incident has been successfully added to the dashboard.",
      variant: "success",
    })
  }

  const handleUpdateIncidentStatus = (id: number, status: string) => {
    setIncidents(incidents.map((incident) => (incident.id === id ? { ...incident, status } : incident)))

    toast({
      title: "Status Updated",
      description: `Incident status changed to ${status}`,
      variant: "default",
    })
  }

  const filteredIncidents = incidents
    .filter((incident) => {
      // Apply all filters
      const matchesSeverity = filterSeverity === "All" || incident.severity === filterSeverity
      const matchesStatus = filterStatus === "All" || incident.status === filterStatus
      const matchesCategory = filterCategory === "All" || incident.category === filterCategory
      const matchesSearch =
        searchQuery === "" ||
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSeverity && matchesStatus && matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime()
      const dateB = new Date(b.reported_at).getTime()

      if (sortOrder === "Newest First") return dateB - dateA
      if (sortOrder === "Oldest First") return dateA - dateB

      if (sortOrder === "Severity (High-Low)") {
        const severityOrder = { High: 3, Medium: 2, Low: 1 }
        return (
          severityOrder[b.severity as keyof typeof severityOrder] -
          severityOrder[a.severity as keyof typeof severityOrder]
        )
      }

      if (sortOrder === "Severity (Low-High)") {
        const severityOrder = { High: 3, Medium: 2, Low: 1 }
        return (
          severityOrder[a.severity as keyof typeof severityOrder] -
          severityOrder[b.severity as keyof typeof severityOrder]
        )
      }

      return dateB - dateA
    })

  const handleExportData = () => {
    exportToCSV(filteredIncidents, "ai-safety-incidents")
    toast({
      title: "Export Successful",
      description: "Incident data has been exported to CSV",
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardHeader />

      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search incidents..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>

              <Button onClick={handleExportData} variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>

              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {showForm ? "Cancel" : "Report Incident"}
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <ReportIncidentForm onSubmit={handleAddIncident} onCancel={() => setShowForm(false)} />
            </div>
          )}

          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <DashboardMetrics incidents={incidents} isLoading={isLoading} />

            <Card className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Incidents</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("incidents")}>
                  View All
                </Button>
              </div>
              <IncidentList
                incidents={incidents.slice(0, 5)}
                isLoading={isLoading}
                onUpdateStatus={handleUpdateIncidentStatus}
                compact
              />
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="mt-6 space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <FilterSortControls
                  filterSeverity={filterSeverity}
                  setFilterSeverity={setFilterSeverity}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
              </div>

              <IncidentList
                incidents={filteredIncidents}
                isLoading={isLoading}
                onUpdateStatus={handleUpdateIncidentStatus}
              />
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Incident Timeline</h2>
              <IncidentTimeline incidents={filteredIncidents} isLoading={isLoading} />
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Incident Analytics</h2>
              <IncidentAnalytics incidents={incidents} isLoading={isLoading} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <KeyboardShortcutsHelp open={showKeyboardHelp} onOpenChange={setShowKeyboardHelp} />
      <Toaster />
    </div>
  )
}
