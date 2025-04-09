"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { ItemContent } from "./item-content"
import type { SortableItemProps } from "./types"

export function SortableItem({ item, onEditField, onDeleteField, isEditing }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      suppressHydrationWarning
      ref={setNodeRef}
      style={style}
      className={`rounded-md border bg-white p-3 shadow-sm ${
        isEditing ? "border-primary ring-1 ring-primary" : "border-gray-200"
      }`}
      {...attributes}
    >
      <div className="flex items-start">
        <div className="mt-1 mr-2" {...listeners}>
          <GripVertical className="h-5 w-5 text-gray-400 cursor-grab touch-none" />
        </div>
        <ItemContent item={item} onEditField={onEditField} onDeleteField={onDeleteField} />
      </div>
    </div>
  )
}
