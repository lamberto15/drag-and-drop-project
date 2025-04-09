"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Item } from "./types"

interface FormPreviewProps {
  formFields: Item[]
  onBackToEditor: () => void
}

export function FormPreview({ formFields, onBackToEditor }: FormPreviewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    console.log("Form submitted with values:", formValues)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          {formSubmitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Form Submitted Successfully!</h2>
              <p className="text-gray-500 mb-4">Thank you for your submission.</p>
              <Button onClick={() => setFormSubmitted(false)}>Submit Another Response</Button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {formFields.length > 0 ? (
                formFields.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`preview-${item.id}`} className="font-medium text-sm">
                        {item.label} {item.required && <span className="text-red-500">*</span>}
                      </label>
                      {item.description && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {item.type === "text" && (
                      <Input
                        id={`preview-${item.id}`}
                        type="text"
                        name={item.name}
                        placeholder={item.placeholder}
                        value={formValues[item.name] || ""}
                        onChange={handleFormChange}
                        required={item.required}
                      />
                    )}
                    {item.type === "email" && (
                      <Input
                        id={`preview-${item.id}`}
                        type="email"
                        name={item.name}
                        placeholder={item.placeholder}
                        value={formValues[item.name] || ""}
                        onChange={handleFormChange}
                        required={item.required}
                      />
                    )}
                    {item.type === "password" && (
                      <Input
                        id={`preview-${item.id}`}
                        type="password"
                        name={item.name}
                        placeholder={item.placeholder}
                        value={formValues[item.name] || ""}
                        onChange={handleFormChange}
                        required={item.required}
                      />
                    )}
                    {item.type === "tel" && (
                      <Input
                        id={`preview-${item.id}`}
                        type="tel"
                        name={item.name}
                        placeholder={item.placeholder}
                        pattern={item.pattern}
                        value={formValues[item.name] || ""}
                        onChange={handleFormChange}
                        required={item.required}
                      />
                    )}
                    {item.type === "date" && (
                      <Input
                        id={`preview-${item.id}`}
                        type="date"
                        name={item.name}
                        value={formValues[item.name] || ""}
                        onChange={handleFormChange}
                        required={item.required}
                      />
                    )}
                    {item.type === "number" && (
                      <Input
                        id={`preview-${item.id}`}
                        type="number"
                        name={item.name}
                        placeholder={item.placeholder}
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        value={formValues[item.name] || ""}
                        onChange={handleFormChange}
                        required={item.required}
                      />
                    )}
                    {item.type === "checkbox" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`preview-${item.id}`}
                          name={item.name}
                          checked={formValues[item.name] || false}
                          onCheckedChange={(checked) =>
                            setFormValues((prev) => ({
                              ...prev,
                              [item.name]: checked === true,
                            }))
                          }
                          required={item.required}
                        />
                        <label htmlFor={`preview-${item.id}`} className="text-sm text-gray-600">
                          I confirm
                        </label>
                      </div>
                    )}
                    {item.type === "select" && item.options && (
                      <Select
                        name={item.name}
                        value={formValues[item.name] || ""}
                        onValueChange={(value) =>
                          setFormValues((prev) => ({
                            ...prev,
                            [item.name]: value,
                          }))
                        }
                        required={item.required}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={item.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options.map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {item.type === "textarea" && (
                      <Textarea
                        id={`preview-${item.id}`}
                        name={item.name}
                        placeholder={item.placeholder}
                        value={formValues[item.name] || ""}
                        onChange={handleFormChange}
                        required={item.required}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Form Fields Added</h3>
                  <p className="text-gray-500 mb-4">Drag fields from the available fields panel to build your form.</p>
                  <Button variant="outline" onClick={onBackToEditor}>
                    Back to Editor
                  </Button>
                </div>
              )}

              {formFields.length > 0 && (
                <Button type="submit" className="w-full">
                  Submit Form
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
