"use client"

import { useSortable } from "@dnd-kit/sortable"
import { SortableContext } from "@dnd-kit/sortable"
import { Badge } from "@/components/ui/badge"
import { SortableItem } from "./sortable-item"
import type { ContainerProps } from "./types"

export function Container({ id, title, items, itemIds, onEditField, onDeleteField, editingField }: ContainerProps) {
  const { setNodeRef } = useSortable({
    id,
    data: {
      type: "container",
    },
  })

  return (
    <div
      ref={setNodeRef}
      className="flex min-h-[400px] flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="outline">
          {items.length} {items.length === 1 ? "field" : "fields"}
        </Badge>
      </div>
      <SortableContext items={itemIds}>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {items.length > 0 ? (
            items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onEditField={onEditField}
                onDeleteField={onDeleteField}
                isEditing={item.id === editingField}
              />
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-gray-200 p-8 text-gray-400">
              {id === "container1" ? "No available fields" : "Drop fields here to build your form"}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
