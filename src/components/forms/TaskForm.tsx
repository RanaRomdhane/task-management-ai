'use client'
import { TASK_CATEGORIES, PRIORITY_OPTIONS, DURATION_PRESETS } from '@/lib/taskCategories'
import { TASK_TEMPLATES, TaskTemplate } from '@/lib/taskTemplates'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTaskStore } from '@/lib/utils'

// Form validation schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.string().min(1, 'Category is required'),
  estimatedDuration: z.number().min(5, 'Minimum 5 minutes').max(480, 'Maximum 8 hours'),
  deadline: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  onClose?: () => void
}

export default function TaskForm({ onClose }: TaskFormProps) {
  const addTask = useTaskStore((state) => state.addTask)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
      estimatedDuration: 30,
    }
  })

  const onSubmit = async (data: TaskFormData) => {
    try {
        addTask({
            title: data.title,
            description: data.description || '',
            priority: data.priority,
            category: data.category,
            estimatedDuration: data.estimatedDuration,
            deadline: data.deadline ? new Date(data.deadline) : undefined,
            dependencies: [],
            status: 'inbox',
            // GTDTask specific properties
            gtdCategory: 'inbox', // Default to inbox for new tasks
            isUrgent: data.priority === 'high', // Consider high priority as urgent
            isImportant: data.priority === 'high' || data.priority === 'medium', // High/medium as important
            energy: 'medium', // Default energy level
            isHighImpact: false, // Add this property
            importance: 0, // Add this property
            estimatedImpact: 0, // Add this property
          });
      
      reset();
      onClose?.();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task..."
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Priority and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority Field */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                onValueChange={(value) => setValue('priority', value as 'high' | 'medium' | 'low')}
                defaultValue="medium"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">💼 Work</SelectItem>
                  <SelectItem value="personal">👤 Personal</SelectItem>
                  <SelectItem value="urgent">⚡ Urgent</SelectItem>
                  <SelectItem value="meetings">👥 Meetings</SelectItem>
                  <SelectItem value="development">💻 Development</SelectItem>
                  <SelectItem value="research">📚 Research</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Duration and Deadline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estimated Duration */}
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Duration (minutes) *</Label>
              <Input
                id="estimatedDuration"
                type="number"
                min="5"
                max="480"
                step="15"
                {...register('estimatedDuration', { valueAsNumber: true })}
                className={errors.estimatedDuration ? 'border-red-500' : ''}
              />
              {errors.estimatedDuration && (
                <p className="text-sm text-red-500">{errors.estimatedDuration.message}</p>
              )}
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                type="datetime-local"
                {...register('deadline')}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}