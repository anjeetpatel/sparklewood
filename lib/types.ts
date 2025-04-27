export interface Incident {
  id: number
  title: string
  description: string
  severity: "Low" | "Medium" | "High"
  reported_at: string
  status: "New" | "In Review" | "Resolved"
  category?: string
  steps_to_reproduce?: string[]
  assigned_to?: string
}
