// src/lib/priority-calculator.ts
import { Task, TaskPriority, PriorityWeights } from '@/types/priority';

export class PriorityCalculator {
  private weights: PriorityWeights = {
    deadline: 0.4,
    importance: 0.3,
    dependencies: 0.2,
    impact: 0.1
  };

  constructor(customWeights?: Partial<PriorityWeights>) {
    if (customWeights) {
      this.weights = { ...this.weights, ...customWeights };
    }
  }

  calculateTaskPriority(task: Task): TaskPriority {
    const deadlineScore = this.calculateDeadlineScore(task);
    const importanceScore = this.calculateImportanceScore(task);
    const dependencyScore = this.calculateDependencyScore(task);
    const impactScore = this.calculateImpactScore(task);

    const totalScore = 
      (deadlineScore * this.weights.deadline) +
      (importanceScore * this.weights.importance) +
      (dependencyScore * this.weights.dependencies) +
      (impactScore * this.weights.impact);

    return {
      score: Math.round(totalScore * 100) / 100,
      breakdown: {
        deadlineScore,
        importanceScore,
        dependencyScore,
        impactScore
      },
      is8020Task: false, // Will be calculated later
      category: this.categorizePriority(totalScore)
    };
  }

  private calculateDeadlineScore(task: Task): number {
    if (!task.deadline) return 5; // Default score for no deadline

    const now = new Date();
    const deadline = new Date(task.deadline);
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline < 0) return 10; // Overdue
    if (daysUntilDeadline === 0) return 9; // Due today
    if (daysUntilDeadline === 1) return 8; // Due tomorrow
    if (daysUntilDeadline <= 3) return 7; // Due within 3 days
    if (daysUntilDeadline <= 7) return 6; // Due within a week
    if (daysUntilDeadline <= 14) return 5; // Due within 2 weeks
    if (daysUntilDeadline <= 30) return 4; // Due within a month
    
    return Math.max(1, 4 - Math.floor(daysUntilDeadline / 30)); // Further out
  }

  private calculateImportanceScore(task: Task): number {
    // Convert task.priority and task.importance to a score
    const priorityMapping = { high: 8, medium: 5, low: 2 };
    const basePriority = priorityMapping[task.priority];
    const importanceScore = task.importance || 5; // Default to 5 if not set
    
    return Math.min(10, (basePriority + importanceScore) / 2);
  }

  private calculateDependencyScore(task: Task): number {
    // More dependencies = higher priority (blocking others)
    const dependencyCount = task.dependencies.length;
    if (dependencyCount === 0) return 5; // Neutral
    if (dependencyCount >= 5) return 10; // High blocker
    
    return 5 + dependencyCount;
  }

  private calculateImpactScore(task: Task): number {
    return task.estimatedImpact || 5; // Default to 5 if not set
  }

  private categorizePriority(score: number): 'critical' | 'important' | 'moderate' | 'low' {
    if (score >= 8) return 'critical';
    if (score >= 6) return 'important';
    if (score >= 4) return 'moderate';
    return 'low';
  }

  // 80/20 Rule Implementation
  identify8020Tasks(tasks: Task[]): Task[] {
    // Calculate priorities for all tasks
    const tasksWithPriority = tasks.map(task => ({
      ...task,
      calculatedPriority: this.calculateTaskPriority(task)
    }));

    // Sort by priority score (highest first)
    tasksWithPriority.sort((a, b) => 
      (b.calculatedPriority?.score || 0) - (a.calculatedPriority?.score || 0)
    );

    // Mark top 20% as 80/20 tasks
    const top20PercentCount = Math.ceil(tasksWithPriority.length * 0.2);
    
    return tasksWithPriority.map((task, index) => ({
      ...task,
      calculatedPriority: {
        ...task.calculatedPriority!,
        is8020Task: index < top20PercentCount
      }
    }));
  }
}