import { Task } from '@/types/task'

export interface TaskTemplate {
  id: string
  name: string
  title: string
  description?: string
  category: string
  priority: 'high' | 'medium' | 'low'
  estimatedDuration: number
  dependencies?: string[]
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'daily-standup',
    name: 'Daily Standup Meeting',
    title: 'Daily Standup Meeting',
    description: 'Team synchronization meeting',
    category: 'meetings',
    priority: 'high',
    estimatedDuration: 30,
  },
  {
    id: 'code-review',
    name: 'Code Review',
    title: 'Review Pull Request',
    description: 'Review and provide feedback on code changes',
    category: 'development',
    priority: 'medium',
    estimatedDuration: 45,
  },
  {
    id: 'email-processing',
    name: 'Process Emails',
    title: 'Process and respond to emails',
    description: 'Check inbox, respond to urgent emails, organize others',
    category: 'admin',
    priority: 'medium',
    estimatedDuration: 30,
  },
  {
    id: 'project-planning',
    name: 'Project Planning',
    title: 'Plan project milestones',
    description: 'Define tasks, timelines, and deliverables',
    category: 'work',
    priority: 'high',
    estimatedDuration: 120,
  },
  {
    id: 'client-call',
    name: 'Client Call',
    title: 'Client consultation call',
    description: 'Discuss project requirements and updates',
    category: 'meetings',
    priority: 'high',
    estimatedDuration: 60,
  },
]

export const getTemplateByCategory = (category: string): TaskTemplate[] => {
  return TASK_TEMPLATES.filter(template => template.category === category)
}