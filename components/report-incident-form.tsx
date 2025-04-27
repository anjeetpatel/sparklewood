"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Incident } from "@/lib/types"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  severity: z.enum(["Low", "Medium", "High"], {
    required_error: "Please select a severity level.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  steps_to_reproduce: z.array(z.string()).optional(),
  assigned_to: z.string().optional(),
})

interface ReportIncidentFormProps {
  onSubmit: (data: Omit<Incident, "id" | "reported_at">) => void
  onCancel?: () => void
}

export default function ReportIncidentForm({ onSubmit, onCancel }: ReportIncidentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "Medium",
      category: "Bias",
      steps_to_reproduce: ["", "", ""],
      assigned_to: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Filter out empty steps
    const filteredSteps = values.steps_to_reproduce?.filter((step) => step.trim() !== "") || []

    onSubmit({
      ...values,
      steps_to_reproduce: filteredSteps.length > 0 ? filteredSteps : undefined,
      status: "New",
    })
    form.reset()
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg border-b">
        <CardTitle className="text-xl">Report New Incident</CardTitle>
        <CardDescription>
          Document an AI safety incident with detailed information to help track and resolve issues.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="mb-4 grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a descriptive title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about what happened, potential impacts, and any relevant context"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Severity Level</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Low" />
                              </FormControl>
                              <FormLabel className="font-normal text-green-700 dark:text-green-400">
                                Low - Minor issues with limited impact
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Medium" />
                              </FormControl>
                              <FormLabel className="font-normal text-amber-700 dark:text-amber-400">
                                Medium - Significant issues requiring attention
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="High" />
                              </FormControl>
                              <FormLabel className="font-normal text-red-700 dark:text-red-400">
                                High - Critical issues with serious potential consequences
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Bias">Bias</SelectItem>
                            <SelectItem value="Hallucination">Hallucination</SelectItem>
                            <SelectItem value="Data Leak">Data Leak</SelectItem>
                            <SelectItem value="Performance">Performance</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the category that best describes the incident</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <FormField
                  control={form.control}
                  name="steps_to_reproduce"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Steps to Reproduce</FormLabel>
                      <FormDescription>List the steps to reproduce this incident (optional)</FormDescription>
                      <div className="space-y-2">
                        {field.value?.map((_, index) => (
                          <FormControl key={index}>
                            <Input
                              placeholder={`Step ${index + 1}`}
                              value={field.value?.[index] || ""}
                              onChange={(e) => {
                                const newSteps = [...(field.value || [])]
                                newSteps[index] = e.target.value
                                field.onChange(newSteps)
                              }}
                            />
                          </FormControl>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assigned_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Assign to team member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          <SelectItem value="AI Safety Team">AI Safety Team</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Optionally assign this incident to a person or team</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-end gap-3 px-0 pt-4 border-t">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit Incident Report
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
