import { create } from 'zustand'
import { Task, TaskBatch } from '@/types/task'

interface TaskStore {
  tasks: Task[]
  batches: TaskBatch[]
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  addBatch: (batch: Omit<TaskBatch, 'id' | 'createdAt'>) => void
  updateBatch: (id: string, updates: Partial<TaskBatch>) => void
  deleteBatch: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  batches: [],
  
  addTask: (taskData) => set((state) => ({
    tasks: [...state.tasks, {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  addBatch: (batchData) => set((state) => ({
    batches: [...state.batches, {
      ...batchData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }]
  })),
  
  updateBatch: (id, updates) => set((state) => ({
    batches: state.batches.map(batch => 
      batch.id === id ? { ...batch, ...updates } : batch
    )
  })),
  
  deleteBatch: (id) => set((state) => ({
    batches: state.batches.filter(batch => batch.id !== id)
  })),
}))