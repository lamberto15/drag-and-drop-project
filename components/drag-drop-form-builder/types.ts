import type { UniqueIdentifier } from "@dnd-kit/core"

export interface Item {
  id: UniqueIdentifier
  type: "text" | "date" | "checkbox" | "select" | "textarea" | "number" | "email" | "tel" | "password"
  label: string
  name: string
  required?: boolean
  placeholder?: string
  options?: string[]
  description?: string
  min?: number
  max?: number
  step?: number
  pattern?: string
}

export interface ContainerProps {
  id: string
  title: string
  items: Item[]
  itemIds: UniqueIdentifier[]
  onEditField: (id: UniqueIdentifier) => void
  onDeleteField: (id: UniqueIdentifier) => void
  editingField: UniqueIdentifier | null
}

export interface ItemContentProps {
  item: Item
  isDragOverlay?: boolean
  onEditField?: (id: UniqueIdentifier) => void
  onDeleteField?: (id: UniqueIdentifier) => void
}

export interface SortableItemProps {
  item: Item
  onEditField: (id: UniqueIdentifier) => void
  onDeleteField: (id: UniqueIdentifier) => void
  isEditing: boolean
}
