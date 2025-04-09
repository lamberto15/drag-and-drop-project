/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import type { UniqueIdentifier } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Item } from "@/components/drag-drop-form-builder/types"

// Initial data for the containers
const initialItems: Record<string, Item[]> = {
  container1: [
    {
      id: "1",
      label: "Full name",
      type: "text",
      name: "fullName",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      id: "2",
      label: "Legal Age",
      type: "checkbox",
      name: "isLegalAge",
      required: true,
    },
    {
      id: "3",
      label: "Username",
      type: "text",
      name: "username",
      placeholder: "Choose a username",
      required: false,
    },
    {
      id: "4",
      label: "Birthday",
      type: "date",
      name: "birthday",
      required: false,
    },
    {
      id: "5",
      label: "Email Address",
      type: "email",
      name: "email",
      placeholder: "your.email@example.com",
      required: true,
    },
    {
      id: "6",
      label: "Phone Number",
      type: "tel",
      name: "phone",
      placeholder: "+1 (555) 123-4567",
      required: false,
    },
    {
      id: "7",
      label: "Password",
      type: "password",
      name: "password",
      required: true,
    },
    {
      id: "8",
      label: "Department",
      type: "select",
      name: "department",
      options: ["Engineering", "Marketing", "Sales", "Customer Support", "Human Resources"],
      required: false,
    },
    {
      id: "9",
      label: "Cover Letter",
      type: "textarea",
      name: "coverLetter",
      placeholder: "Tell us why you're interested in this position...",
      required: false,
    },
    {
      id: "10",
      label: "Years of Experience",
      type: "number",
      name: "experience",
      min: 0,
      max: 50,
      step: 1,
      required: false,
    },
  ],
  container2: [],
}

interface FormBuilderState {
  // State
  items: Record<string, Item[]>
  activeId: UniqueIdentifier | null
  editingField: UniqueIdentifier | null
  editingValues: Item | null
  previewMode: boolean
  formValues: Record<string, any>
  formSubmitted: boolean

  // Actions
  setActiveId: (id: UniqueIdentifier | null) => void
  findActiveItem: () => Item | null
  findContainer: (id: UniqueIdentifier) => string | null
  handleDragStart: (active: UniqueIdentifier) => void
  handleDragOver: (active: UniqueIdentifier, over: UniqueIdentifier | null) => void
  handleDragEnd: (active: UniqueIdentifier, over: UniqueIdentifier | null) => void
  getContainerIds: (containerId: string) => UniqueIdentifier[]
  handleEditField: (itemId: UniqueIdentifier) => void
  handleSaveEdit: () => void
  handleCancelEdit: () => void
  handleEditChange: (name: string, value: any, type?: string) => void
  handleSelectChange: (name: string, value: string) => void
  handleSwitchChange: (name: string, checked: boolean) => void
  handleOptionsChange: (options: string) => void
  handleDeleteField: (itemId: UniqueIdentifier) => void
  handleAddField: () => void
  togglePreviewMode: () => void
  handleFormChange: (name: string, value: any, type?: string) => void
  handleFormSubmit: () => void
  resetFormSubmission: () => void
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  // State
  items: initialItems,
  activeId: null,
  editingField: null,
  editingValues: null,
  previewMode: false,
  formValues: {},
  formSubmitted: false,

  // Actions
  setActiveId: (id) => set({ activeId: id }),

  findActiveItem: () => {
    const { activeId, items } = get()
    if (!activeId) return null

    for (const [containerId, containerItems] of Object.entries(items)) {
      const item = containerItems.find((item) => item.id === activeId)
      if (item) return item
    }

    return null
  },

  findContainer: (id) => {
    const { items } = get()
    if (id in items) return id as string

    for (const [containerId, containerItems] of Object.entries(items)) {
      if (containerItems.some((item) => item.id === id)) {
        return containerId
      }
    }

    return null
  },

  handleDragStart: (active) => {
    set({ activeId: active, editingField: null })
  },

  handleDragOver: (active, over) => {
    if (!over) return

    const { findContainer, items } = get()
    const activeContainer = findContainer(active)
    const overContainer = findContainer(over)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    set((state) => {
      const activeItems = [...state.items[activeContainer]]
      const overItems = [...state.items[overContainer]]

      const activeIndex = activeItems.findIndex((item) => item.id === active)

      // Remove from original container
      const [item] = activeItems.splice(activeIndex, 1)

      // If dropping over a container, add to the end
      if (over === overContainer) {
        overItems.push(item)
      } else {
        // Get the index of the item being dropped over
        const overIndex = overItems.findIndex((item) => item.id === over)
        // Insert the item at that index
        overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, item)
      }

      return {
        items: {
          ...state.items,
          [activeContainer]: activeItems,
          [overContainer]: overItems,
        },
      }
    })
  },

  handleDragEnd: (active, over) => {
    if (!over) {
      set({ activeId: null })
      return
    }

    const { findContainer, items } = get()
    const activeContainer = findContainer(active)
    const overContainer = findContainer(over)

    if (!activeContainer || !overContainer) {
      set({ activeId: null })
      return
    }

    // If the item is dropped in a different container, this was already handled in dragOver
    if (activeContainer !== overContainer) {
      set({ activeId: null })
      return
    }

    // If dropping in the same container, we need to reorder
    const activeIndex = items[activeContainer].findIndex((item) => item.id === active)
    const overIndex = items[overContainer].findIndex((item) => item.id === over)

    if (activeIndex !== overIndex) {
      set((state) => ({
        items: {
          ...state.items,
          [activeContainer]: arrayMove(state.items[activeContainer], activeIndex, overIndex),
        },
        activeId: null,
      }))
    } else {
      set({ activeId: null })
    }
  },

  getContainerIds: (containerId) => {
    const { items } = get()
    return items[containerId].map((item) => item.id)
  },

  handleEditField: (itemId) => {
    const { activeId, findContainer, items } = get()
    // Don't allow editing if we're currently dragging
    if (activeId) return

    const container = findContainer(itemId)
    if (!container) return

    const item = items[container].find((item) => item.id === itemId)
    if (!item) return

    set({ editingField: itemId, editingValues: { ...item } })
  },

  handleSaveEdit: () => {
    const { editingField, editingValues, findContainer } = get()
    if (!editingField || !editingValues) return

    const container = findContainer(editingField)
    if (!container) return

    set((state) => {
      const containerItems = [...state.items[container]]
      const itemIndex = containerItems.findIndex((item) => item.id === editingField)

      if (itemIndex === -1) return state

      containerItems[itemIndex] = editingValues

      return {
        items: {
          ...state.items,
          [container]: containerItems,
        },
        editingField: null,
        editingValues: null,
      }
    })
  },

  handleCancelEdit: () => {
    set({ editingField: null, editingValues: null })
  },

  handleEditChange: (name, value, type) => {
    set((state) => {
      if (!state.editingValues) return state

      if (type === "checkbox") {
        return {
          editingValues: {
            ...state.editingValues,
            [name]: value,
          },
        }
      }

      if (type === "number") {
        return {
          editingValues: {
            ...state.editingValues,
            [name]: name === "min" || name === "max" || name === "step" ? Number.parseFloat(value) : value,
          },
        }
      }

      return {
        editingValues: {
          ...state.editingValues,
          [name]: value,
        },
      }
    })
  },

  handleSelectChange: (name, value) => {
    set((state) => {
      if (!state.editingValues) return state

      return {
        editingValues: {
          ...state.editingValues,
          [name]: value,
        },
      }
    })
  },

  handleSwitchChange: (name, checked) => {
    set((state) => {
      if (!state.editingValues) return state

      return {
        editingValues: {
          ...state.editingValues,
          [name]: checked,
        },
      }
    })
  },

  handleOptionsChange: (options) => {
    set((state) => {
      if (!state.editingValues) return state

      return {
        editingValues: {
          ...state.editingValues,
          options: options.split(",").map((option) => option.trim()),
        },
      }
    })
  },

  handleDeleteField: (itemId) => {
    const { findContainer } = get()
    const container = findContainer(itemId)
    if (!container) return

    set((state) => {
      const containerItems = [...state.items[container]]
      const itemIndex = containerItems.findIndex((item) => item.id === itemId)

      if (itemIndex === -1) return state

      containerItems.splice(itemIndex, 1)

      return {
        items: {
          ...state.items,
          [container]: containerItems,
        },
      }
    })
  },

  handleAddField: () => {
    const newId = `new-${Date.now()}`
    const newField: Item = {
      id: newId,
      type: "text",
      label: "New Field",
      name: `newField${Date.now()}`,
      required: false,
      placeholder: "Enter value",
    }

    set((state) => ({
      items: {
        ...state.items,
        container1: [...state.items.container1, newField],
      },
    }))
  },

  togglePreviewMode: () => {
    set((state) => ({
      previewMode: !state.previewMode,
      formSubmitted: false,
      formValues: {},
    }))
  },

  handleFormChange: (name, value, type) => {
    set((state) => ({
      formValues: {
        ...state.formValues,
        [name]: type === "checkbox" ? value : value,
      },
    }))
  },

  handleFormSubmit: () => {
    set({ formSubmitted: true })
    console.log("Form submitted with values:", get().formValues)
  },

  resetFormSubmission: () => {
    set({ formSubmitted: false, formValues: {} })
  },
}))
