# Database Schema Design

## Task Table

- id: string (UUID)
- title: string
- description: string (optional)
- priority: enum ('high', 'medium', 'low')
- category: string
- estimatedDuration: number (minutes)
- deadline: date (optional)
- dependencies: array of task IDs
- status: enum ('inbox', 'next-action', 'waiting', 'completed')
- batchId: string (optional)
- createdAt: date
- updatedAt: date

## Batch Table

- id: string (UUID)
- name: string
- tasks: array of task IDs
- estimatedDuration: number
- scheduledTime: date (optional)
- createdAt: date

## User Settings Table

- id: string
- pomodoroTimer: number (default 25)
- breakTimer: number (default 5)
- gtdCategories: array of strings
- workingHours: object
