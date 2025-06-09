export interface Task {
    id: string
    title: string
    description?: string
    priority: 'high' | 'medium' | 'low'
    category: string
    estimatedDuration: number // in minutes
    deadline?: Date
    dependencies: string[] // task IDs
    batchId?: string
    status: 'inbox' | 'next-action' | 'waiting' | 'completed'
    createdAt: Date
    updatedAt: Date
  }
  
  export interface TaskBatch {
    id: string
    name: string
    tasks: Task[]
    estimatedDuration: number
    scheduledTime?: Date
    createdAt: Date
  }
  
  export interface UserSettings {
    pomodoroTimer: number
    breakTimer: number
    gtdCategories: string[]
    workingHours: {
      start: string
      end: string
      days: number[] // 0-6, Sunday to Saturday
    }
  }