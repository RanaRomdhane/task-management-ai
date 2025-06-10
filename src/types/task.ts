export interface Task {
    id: string
    title: string
    description?: string
    priority: 'high' | 'medium' | 'low';
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

  // Add these new types to your existing task.ts file

export type GTDCategory = 'inbox' | 'next-action' | 'waiting' | 'project' | 'someday-maybe' | 'reference';

export type EisenhowerQuadrant = 'urgent-important' | 'important-not-urgent' | 'urgent-not-important' | 'not-urgent-not-important';

export interface GTDTask extends Task {
  gtdCategory: string | GTDCategory | undefined;
  eisenhowerQuadrant?: EisenhowerQuadrant;
  isUrgent: boolean;
  isImportant: boolean;
  context?: string; // e.g., @home, @office, @computer
  energy: 'high' | 'medium' | 'low'; // energy required
  waitingFor?: string; // who/what you're waiting for
  projectId?: string; // if this task belongs to a project
  isHighImpact : boolean
  importance: number;
  estimatedImpact: number;
}

export interface GTDProject {
  id: string;
  title: string;
  description?: string;
  outcome: string; // desired outcome
  nextAction?: string; // next actionable step
  tasks: string[]; // task IDs
  status: 'active' | 'on-hold' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  isHighImpact : boolean
}

export interface WeeklyReview {
  id: string;
  date: Date;
  completedTasks: number;
  inboxProcessed: number;
  projectsReviewed: string[];
  insights: string;
  nextWeekFocus: string[];
}