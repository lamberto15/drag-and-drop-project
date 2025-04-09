"use client"

import type React from "react"

import { useState } from "react"
import type { UniqueIdentifier } from "@dnd-kit/core"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "./container"
import { FieldEditor } from "./field-editor"
import { FormPreview } from "./form-preview"
import { initialItems } from "./initial-data"
import type { Item } from "./types"
import { ItemContent } from "./item-content"

// Import this from @dnd-kit/sortable
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

export function DragDropContainers() {
  // State for items in each container
  const [items, setItems] = useState<Record<string, Item[]>>(initialItems)
  // State for the active item being dragged
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  // State for the currently edited field
  const [editingField, setEditingField] = useState<UniqueIdentifier | null>(null)
  // State for the edited field values
  const [editingValues, setEditingValues] = useState<Item | null>(null)
  // State for preview mode
  const [previewMode, setPreviewMode] = useState(false)

  // Find the active item across all containers
  const findActiveItem = () => {
    if (!activeId) return null

    for (const [containerId, containerItems] of Object.entries(items)) {
      const item = containerItems.find((item) => item.id === activeId)
      if (item) return item
    }

    return null
  }

  // Find the container that contains an item
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) return id

    for (const [containerId, containerItems] of Object.entries(items)) {
      if (containerItems.some((item) => item.id === id)) {
        return containerId
      }
    }

    return null
  }

  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id)
    // Close any open editor when starting to drag
    setEditingField(null)
  }

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    setItems((prev) => {
      const activeItems = [...prev[activeContainer]]
      const overItems = [...prev[overContainer]]

      const activeIndex = activeItems.findIndex((item) => item.id === active.id)

      // Remove from original container
      const [item] = activeItems.splice(activeIndex, 1)

      // If dropping over a container, add to the end
      if (over.id === overContainer) {
        overItems.push(item)
      } else {
        // Get the index of the item being dropped over
        const overIndex = overItems.findIndex((item) => item.id === over.id)
        // Insert the item at that index
        overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, item)
      }

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      }
    })
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)

    if (!activeContainer || !overContainer) {
      setActiveId(null)
      return
    }

    // If the item is dropped in a different container, this was already handled in dragOver
    if (activeContainer !== overContainer) {
      setActiveId(null)
      return
    }

    // If dropping in the same container, we need to reorder
    const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id)
    const overIndex = items[overContainer].findIndex((item) => item.id === over.id)

    if (activeIndex !== overIndex) {
      setItems((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
      }))
    }

    setActiveId(null)
  }

  // Get all item IDs for both containers
  const getContainerIds = (containerId: string) => {
    return items[containerId].map((item) => item.id)
  }

  // Start editing a field
  const handleEditField = (itemId: UniqueIdentifier) => {
    // Don't allow editing if we're currently dragging
    if (activeId) return

    const container = findContainer(itemId)
    if (!container) return

    const item = items[container].find((item) => item.id === itemId)
    if (!item) return

    setEditingField(itemId)
    setEditingValues({ ...item })
  }

  // Save edited field
  const handleSaveEdit = () => {
    if (!editingField || !editingValues) return

    const container = findContainer(editingField)
    if (!container) return

    setItems((prev) => {
      const containerItems = [...prev[container]]
      const itemIndex = containerItems.findIndex((item) => item.id === editingField)

      if (itemIndex === -1) return prev

      containerItems[itemIndex] = editingValues

      return {
        ...prev,
        [container]: containerItems,
      }
    })

    setEditingField(null)
    setEditingValues(null)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingField(null)
    setEditingValues(null)
  }

  // Handle input changes in editor
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingValues) return

    const { name, value, type } = e.target as HTMLInputElement

    setEditingValues((prev) => {
      if (!prev) return null

      if (type === "checkbox") {
        return {
          ...prev,
          [name]: (e.target as HTMLInputElement).checked,
        }
      }

      if (type === "number") {
        return {
          ...prev,
          [name]: name === "min" || name === "max" || name === "step" ? Number.parseFloat(value) : value,
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  // Handle select changes in editor
  const handleSelectChange = (name: string, value: string) => {
    if (!editingValues) return

    setEditingValues((prev) => {
      if (!prev) return null

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  // Handle switch changes in editor
  const handleSwitchChange = (name: string, checked: boolean) => {
    if (!editingValues) return

    setEditingValues((prev) => {
      if (!prev) return null

      return {
        ...prev,
        [name]: checked,
      }
    })
  }

  // Handle options changes in editor
  const handleOptionsChange = (options: string) => {
    if (!editingValues) return

    setEditingValues((prev) => {
      if (!prev) return null

      return {
        ...prev,
        options: options.split(",").map((option) => option.trim()),
      }
    })
  }

  // Delete a field
  const handleDeleteField = (itemId: UniqueIdentifier) => {
    const container = findContainer(itemId)
    if (!container) return

    setItems((prev) => {
      const containerItems = [...prev[container]]
      const itemIndex = containerItems.findIndex((item) => item.id === itemId)

      if (itemIndex === -1) return prev

      containerItems.splice(itemIndex, 1)

      return {
        ...prev,
        [container]: containerItems,
      }
    })
  }

  // Add a new field
  const handleAddField = () => {
    const newId = `new-${Date.now()}`
    const newField: Item = {
      id: newId,
      type: "text",
      label: "New Field",
      name: `newField${Date.now()}`,
      required: false,
      placeholder: "Enter value",
    }

    setItems((prev) => ({
      ...prev,
      container1: [...prev.container1, newField],
    }))
  }

  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode)
  }

  const activeItem = findActiveItem()

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Form Builder</h1>
        <div className="flex gap-2">
          <Button onClick={togglePreviewMode}>{previewMode ? "Back to Editor" : "Preview Form"}</Button>
          {!previewMode && (
            <Button variant="outline" onClick={handleAddField}>
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          )}
        </div>
      </div>

      {previewMode ? (
        <FormPreview formFields={items.container2} onBackToEditor={togglePreviewMode} />
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Container
              id="container1"
              title="Available Fields"
              items={items.container1}
              itemIds={getContainerIds("container1")}
              onEditField={handleEditField}
              onDeleteField={handleDeleteField}
              editingField={editingField}
            />

            <Container
              id="container2"
              title="Form Fields"
              items={items.container2}
              itemIds={getContainerIds("container2")}
              onEditField={handleEditField}
              onDeleteField={handleDeleteField}
              editingField={editingField}
            />

            <DragOverlay>
              {activeItem ? (
                <div className="rounded-md border border-dashed border-gray-400 bg-white p-3 shadow-md">
                  <ItemContent item={activeItem} isDragOverlay />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {editingField && editingValues && (
            <FieldEditor
              editingField={editingField}
              editingValues={editingValues}
              onCancel={handleCancelEdit}
              onSave={handleSaveEdit}
              onEditChange={handleEditChange}
              onSelectChange={handleSelectChange}
              onSwitchChange={handleSwitchChange}
              onOptionsChange={handleOptionsChange}
            />
          )}
        </div>
      )}
    </div>
  )
}
