"use client"

import type React from "react"

import type { UniqueIdentifier } from "@dnd-kit/core"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Item } from "./types"

interface FieldEditorProps {
  editingField: UniqueIdentifier
  editingValues: Item
  onCancel: () => void
  onSave: () => void
  onEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onSelectChange: (name: string, value: string) => void
  onSwitchChange: (name: string, checked: boolean) => void
  onOptionsChange: (options: string) => void
}

export function FieldEditor({
  editingField,
  editingValues,
  onCancel,
  onSave,
  onEditChange,
  onSelectChange,
  onSwitchChange,
  onOptionsChange,
}: FieldEditorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Field Properties</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="edit-label" className="mb-1">
                Label
              </Label>
              <Input id="edit-label" type="text" name="label" value={editingValues.label} onChange={onEditChange} />
            </div>

            <div>
              <Label htmlFor="edit-name" className="mb-1">
                Name (ID)
              </Label>
              <Input id="edit-name" type="text" name="name" value={editingValues.name} onChange={onEditChange} />
            </div>

            <div>
              <Label htmlFor="edit-type" className="mb-1">
                Field Type
              </Label>
              <Select name="type" value={editingValues.type} onValueChange={(value) => onSelectChange("type", value)}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="tel">Telephone</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-required"
                name="required"
                checked={editingValues.required || false}
                onCheckedChange={(checked) => onSwitchChange("required", checked)}
              />
              <Label htmlFor="edit-required">Required field</Label>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {(editingValues.type === "text" ||
              editingValues.type === "email" ||
              editingValues.type === "password" ||
              editingValues.type === "tel" ||
              editingValues.type === "textarea") && (
              <div>
                <Label htmlFor="edit-placeholder" className="mb-1">
                  Placeholder
                </Label>
                <Input
                  id="edit-placeholder"
                  type="text"
                  name="placeholder"
                  value={editingValues.placeholder || ""}
                  onChange={onEditChange}
                />
              </div>
            )}

            {editingValues.type === "select" && (
              <div>
                <Label htmlFor="edit-options" className="mb-1">
                  Options (comma separated)
                </Label>
                <Textarea
                  id="edit-options"
                  value={editingValues.options?.join(", ") || ""}
                  onChange={(e) => onOptionsChange(e.target.value)}
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}

            {editingValues.type === "number" && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="edit-min" className="mb-1">
                      Min
                    </Label>
                    <Input
                      id="edit-min"
                      type="number"
                      name="min"
                      value={editingValues.min !== undefined ? editingValues.min : ""}
                      onChange={onEditChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-max" className="mb-1">
                      Max
                    </Label>
                    <Input
                      id="edit-max"
                      type="number"
                      name="max"
                      value={editingValues.max !== undefined ? editingValues.max : ""}
                      onChange={onEditChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-step" className="mb-1">
                      Step
                    </Label>
                    <Input
                      id="edit-step"
                      type="number"
                      name="step"
                      value={editingValues.step !== undefined ? editingValues.step : ""}
                      onChange={onEditChange}
                    />
                  </div>
                </div>
              </>
            )}

            {editingValues.type === "tel" && (
              <div>
                <Label htmlFor="edit-pattern" className="mb-1">
                  Pattern (RegEx)
                </Label>
                <Input
                  id="edit-pattern"
                  type="text"
                  name="pattern"
                  value={editingValues.pattern || ""}
                  onChange={onEditChange}
                  placeholder="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                />
              </div>
            )}

            <div>
              <Label htmlFor="edit-description" className="mb-1">
                Help Text
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={editingValues.description || ""}
                onChange={onEditChange}
                placeholder="Additional information about this field"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
