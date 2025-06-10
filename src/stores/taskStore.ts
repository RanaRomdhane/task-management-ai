import { GTDTask, TaskBatch, GTDProject, WeeklyReview } from '@/types/task';

export interface TaskStore {
  tasks: GTDTask[];
  batches: TaskBatch[];
  projects: GTDProject[];
  weeklyReviews: WeeklyReview[];
  
  // Task actions
  addTask: (task: Omit<GTDTask, 'id' | 'createdAt' | 'updatedAt' | 'eisenhowerQuadrant'>) => void;
  updateTask: (id: string, updates: Partial<GTDTask>) => void;
  deleteTask: (id: string) => void;
  processInboxTask: (id: string) => void;
  moveTaskToCategory: (id: string, category: GTDTask['gtdCategory']) => void;
  
  // Project actions
  addProject: (project: Omit<GTDProject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<GTDProject>) => void;
  
  // GTD-specific actions
  getTasksByCategory: (category: GTDTask['gtdCategory']) => GTDTask[];
  getTasksByQuadrant: (quadrant: GTDTask['eisenhowerQuadrant']) => GTDTask[];
  getHighPriorityTasks: () => GTDTask[];
  getTasksByContext: (context: string) => GTDTask[];
  getTasksByEnergy: (energy: 'high' | 'medium' | 'low') => GTDTask[];
  
  // Weekly review
  createWeeklyReview: (review: Omit<WeeklyReview, 'id'>) => void;
  
  // Utility functions
  getInboxCount: () => number;
  getNextActionCount: () => number;
  getWaitingCount: () => number;
}

