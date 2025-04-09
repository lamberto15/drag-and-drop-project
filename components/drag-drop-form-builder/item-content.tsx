"use client"
import { Settings, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ItemContentProps } from "./types"

export function ItemContent({ item, isDragOverlay = false, onEditField, onDeleteField }: ItemContentProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between gap-2 mb-1">
        <label htmlFor={`field-${item.id}`} className="font-medium text-sm">
          {item.label} {item.required && <span className="text-red-500">*</span>}
        </label>

        {!isDragOverlay && (
          <div className="flex items-center gap-1">
            {onEditField && (
              <button
                type="button"
                onClick={() => onEditField(item.id)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
            {onDeleteField && (
              <button
                type="button"
                onClick={() => onDeleteField(item.id)}
                className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      <div>
        {item.type === "text" && (
          <Input
            id={`field-${item.id}`}
            type="text"
            name={item.name}
            placeholder={item.placeholder || `Enter ${item.label.toLowerCase()}`}
            disabled={isDragOverlay}
            required={item.required}
          />
        )}
        {item.type === "email" && (
          <Input
            id={`field-${item.id}`}
            type="email"
            name={item.name}
            placeholder={item.placeholder || `Enter your email`}
            disabled={isDragOverlay}
            required={item.required}
          />
        )}
        {item.type === "password" && (
          <Input
            id={`field-${item.id}`}
            type="password"
            name={item.name}
            placeholder={item.placeholder || `Enter password`}
            disabled={isDragOverlay}
            required={item.required}
          />
        )}
        {item.type === "tel" && (
          <Input
            id={`field-${item.id}`}
            type="tel"
            name={item.name}
            placeholder={item.placeholder || `Enter phone number`}
            disabled={isDragOverlay}
            required={item.required}
          />
        )}
        {item.type === "date" && (
          <Input
            id={`field-${item.id}`}
            type="date"
            name={item.name}
            disabled={isDragOverlay}
            required={item.required}
          />
        )}
        {item.type === "number" && (
          <Input
            id={`field-${item.id}`}
            type="number"
            name={item.name}
            placeholder={item.placeholder || `Enter a number`}
            min={item.min}
            max={item.max}
            step={item.step}
            disabled={isDragOverlay}
            required={item.required}
          />
        )}
        {item.type === "checkbox" && (
          <div className="flex items-center space-x-2">
            <Checkbox id={`field-${item.id}`} name={item.name} disabled={isDragOverlay} required={item.required} />
            <label htmlFor={`field-${item.id}`} className="text-sm text-gray-600">
              I confirm
            </label>
          </div>
        )}
        {item.type === "select" && item.options && (
          <Select disabled={isDragOverlay}>
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
            id={`field-${item.id}`}
            name={item.name}
            placeholder={item.placeholder || `Enter text`}
            disabled={isDragOverlay}
            required={item.required}
          />
        )}
        {item.description && !isDragOverlay && <p className="mt-1 text-xs text-gray-500">{item.description}</p>}
      </div>
    </div>
  )
}
