// src/types/priority.ts
export interface TaskPriority {
    score: number;
    breakdown: {
      deadlineScore: number;
      importanceScore: number;
      dependencyScore: number;
      impactScore: number;
    };
    is8020Task: boolean; // Top 20% of high-impact tasks
    category: 'critical' | 'important' | 'moderate' | 'low';
  }
  
  export interface PriorityWeights {
    deadline: number;    // Default: 0.4 (40%)
    importance: number;  // Default: 0.3 (30%)
    dependencies: number; // Default: 0.2 (20%)
    impact: number;      // Default: 0.1 (10%)
  }
  
  export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    estimatedDuration: number; // in minutes
    deadline?: Date;
    dependencies: string[]; // task IDs
    batchId?: string;
    status: 'inbox' | 'next-action' | 'waiting' | 'completed' | 'someday-maybe';
    createdAt: Date;
    updatedAt: Date;
    // New fields for priority calculation
    importance: number; // 1-10 scale
    estimatedImpact: number; // 1-10 scale
    context?: string; // 'home', 'office', 'phone', 'computer', etc.
    project?: string;
    calculatedPriority?: TaskPriority;
  }