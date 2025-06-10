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
  
    // Ensure task has required properties
    if (!task) return 0;
    task.isUrgent = task.isUrgent ?? false;
    task.isImportant = task.isImportant ?? false;
    task.dependencies = task.dependencies ?? [];
    task.energy = task.energy ?? 'medium'; // Default to medium if undefined
  
    // Deadline proximity (40% weight)
    if (task.deadline) {
      const deadlineDate = task.deadline instanceof Date ? task.deadline : new Date(task.deadline);
      if (!isNaN(deadlineDate.getTime())) {
        const now = new Date();
        const daysUntilDeadline = Math.ceil(
          (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilDeadline <= 1) {
          score += 40;
        } else if (daysUntilDeadline <= 3) {
          score += 30;
        } else if (daysUntilDeadline <= 7) {
          score += 20;
        } else if (daysUntilDeadline <= 14) {
          score += 10;
        }
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
    score += quadrantScores[quadrant] ?? 5; // Default to lowest score if quadrant is invalid
  
    // Dependencies (20% weight)
    score += Math.min(task.dependencies.length * 5, 20);
  
    // Energy vs Time of Day (10% weight)
    const currentHour = new Date().getHours();
    if (task.energy === 'high' && currentHour >= 9 && currentHour <= 11) {
      score += 10;
    } else if (task.energy === 'low' && (currentHour >= 14 && currentHour <= 16)) {
      score += 8;
    } else if (task.energy === 'medium') {
      score += 6;
    }
  
    return Math.min(score, 100);
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