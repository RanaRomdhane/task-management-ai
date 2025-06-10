import { GTDTask, EisenhowerQuadrant } from '@/types/task';
import { addDays, isAfter, isBefore } from 'date-fns';

export function categorizeByEisenhower(task: GTDTask): EisenhowerQuadrant {
  const { isUrgent, isImportant } = task;
  
  if (isUrgent && isImportant) {
    return 'urgent-important';
  } else if (isImportant && !isUrgent) {
    return 'important-not-urgent';
  } else if (isUrgent && !isImportant) {
    return 'urgent-not-important';
  } else {
    return 'not-urgent-not-important';
  }
}

export function calculateTaskPriority(task: GTDTask): number {
  let score = 0;
  
  // Deadline proximity (40% weight)
  if (task.deadline) {
    const now = new Date();
    const daysUntilDeadline = Math.ceil(
      (task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilDeadline <= 1) {
      score += 40; // Due today or overdue
    } else if (daysUntilDeadline <= 3) {
      score += 30; // Due within 3 days
    } else if (daysUntilDeadline <= 7) {
      score += 20; // Due within a week
    } else if (daysUntilDeadline <= 14) {
      score += 10; // Due within 2 weeks
    }
  }
  
  // Eisenhower Matrix (30% weight)
  const quadrantScores = {
    'urgent-important': 30,
    'important-not-urgent': 20,
    'urgent-not-important': 15,
    'not-urgent-not-important': 5
  };
  
  const quadrant = categorizeByEisenhower(task);
  score += quadrantScores[quadrant];
  
  // Dependencies (20% weight)
  score += Math.min(task.dependencies.length * 5, 20);
  
  // Energy vs Time of Day (10% weight)
  const currentHour = new Date().getHours();
  if (task.energy === 'high' && currentHour >= 9 && currentHour <= 11) {
    score += 10; // High energy tasks in morning
  } else if (task.energy === 'low' && (currentHour >= 14 && currentHour <= 16)) {
    score += 8; // Low energy tasks in afternoon
  } else if (task.energy === 'medium') {
    score += 6; // Medium energy tasks anytime
  }
  
  return Math.min(score, 100); // Cap at 100
}

export function shouldMoveToNextAction(task: GTDTask): boolean {
  // Task should move from inbox to next-action if:
  return (
    task.gtdCategory === 'inbox' &&
    task.dependencies.length === 0 &&
    task.estimatedDuration > 0 &&
    task.estimatedDuration <= 120 && // 2 hours or less
    !task.waitingFor
  );
}

export function suggestGTDCategory(task: GTDTask): GTDTask['gtdCategory'] {
  // If it's new and unprocessed
  if (!task.title || task.title.length < 3) {
    return 'inbox';
  }
  
  // If waiting for someone/something
  if (task.waitingFor) {
    return 'waiting';
  }
  
  // If it has multiple dependencies or is complex
  if (task.dependencies.length > 2 || task.estimatedDuration > 120) {
    return 'project';
  }
  
  // If it's not urgent and not important
  if (!task.isUrgent && !task.isImportant) {
    return 'someday-maybe';
  }
  
  // If it's actionable right now
  if (task.dependencies.length === 0 && task.estimatedDuration > 0) {
    return 'next-action';
  }
  
  return 'inbox'; // Default fallback
}

export function getTasksByContext(tasks: GTDTask[], context: string): GTDTask[] {
  return tasks.filter(task => task.context === context);
}

export function getTasksByEnergyLevel(tasks: GTDTask[], energy: GTDTask['energy']): GTDTask[] {
  return tasks.filter(task => task.energy === energy);
}

// 80/20 Rule Implementation
export function identifyHighImpactTasks(tasks: GTDTask[]): GTDTask[] {
  const sortedTasks = tasks
    .map(task => ({
      ...task,
      priorityScore: calculateTaskPriority(task)
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
    
  // Return top 20% of tasks
  const topCount = Math.ceil(tasks.length * 0.2);
  return sortedTasks.slice(0, topCount);
}