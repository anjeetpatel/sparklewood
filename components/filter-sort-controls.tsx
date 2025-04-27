"use client"

import { useState } from "react"
import { Filter, ArrowUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FilterSortControlsProps {
  filterSeverity: string
  setFilterSeverity: (value: string) => void
  filterStatus: string
  setFilterStatus: (value: string) => void
  filterCategory: string
  setFilterCategory: (value: string) => void
  sortOrder: string
  setSortOrder: (value: string) => void
}

export default function FilterSortControls({
  filterSeverity,
  setFilterSeverity,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  sortOrder,
  setSortOrder,
}: FilterSortControlsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const hasActiveFilters = filterSeverity !== "All" || filterStatus !== "All" || filterCategory !== "All"

  const resetFilters = () => {
    setFilterSeverity("All")
    setFilterStatus("All")
    setFilterCategory("All")
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {hasActiveFilters && (
              <Badge className="ml-1 bg-blue-500 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {(filterSeverity !== "All" ? 1 : 0) +
                  (filterStatus !== "All" ? 1 : 0) +
                  (filterCategory !== "All" ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-slate-500">
                  <X className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="severity-filter" className="text-sm font-medium">
                Severity
              </label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger id="severity-filter" className="w-full">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Severities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Status
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="category-filter" className="text-sm font-medium">
                Category
              </label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category-filter" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Bias">Bias</SelectItem>
                  <SelectItem value="Hallucination">Hallucination</SelectItem>
                  <SelectItem value="Data Leak">Data Leak</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px] h-9">
            <div className="flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Newest First">Newest First</SelectItem>
            <SelectItem value="Oldest First">Oldest First</SelectItem>
            <SelectItem value="Severity (High-Low)">Severity (High-Low)</SelectItem>
            <SelectItem value="Severity (Low-High)">Severity (Low-High)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 ml-1">
          {filterSeverity !== "All" && (
            <Badge variant="secondary" className="gap-1 pl-2">
              Severity: {filterSeverity}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0 text-slate-500 hover:text-slate-700"
                onClick={() => setFilterSeverity("All")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove severity filter</span>
              </Button>
            </Badge>
          )}

          {filterStatus !== "All" && (
            <Badge variant="secondary" className="gap-1 pl-2">
              Status: {filterStatus}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0 text-slate-500 hover:text-slate-700"
                onClick={() => setFilterStatus("All")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove status filter</span>
              </Button>
            </Badge>
          )}

          {filterCategory !== "All" && (
            <Badge variant="secondary" className="gap-1 pl-2">
              Category: {filterCategory}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0 text-slate-500 hover:text-slate-700"
                onClick={() => setFilterCategory("All")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove category filter</span>
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
