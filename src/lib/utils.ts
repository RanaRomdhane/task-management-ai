import { TaskStore } from "@/stores/taskStore"
import { GTDTask } from "@/types/task"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { suggestGTDCategory, categorizeByEisenhower, calculateTaskPriority } from "./gtd-utils"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      batches: [],
      projects: [],
      weeklyReviews: [],

      addTask: (taskData) => set((state) => {
        const newTask: GTDTask = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          gtdCategory: taskData.gtdCategory || suggestGTDCategory(taskData as GTDTask),
          eisenhowerQuadrant: categorizeByEisenhower(taskData as GTDTask),
        };

        return {
          tasks: [...state.tasks, newTask]
        };
      }),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => {
          if (task.id === id) {
            const updatedTask = { ...task, ...updates, updatedAt: new Date() };
            // Recalculate Eisenhower quadrant if urgency/importance changed
            if (updates.isUrgent !== undefined || updates.isImportant !== undefined) {
              updatedTask.eisenhowerQuadrant = categorizeByEisenhower(updatedTask);
            }
            return updatedTask;
          }
          return task;
        })
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),

      processInboxTask: (id) => set((state) => {
        const updatedTasks = state.tasks.map(task => {
          if (task.id === id && task.gtdCategory === 'inbox') {
            const suggestedCategory = suggestGTDCategory(task);
            return {
              ...task,
              gtdCategory: suggestedCategory,
              updatedAt: new Date()
            };
          }
          return task;
        });

        return { tasks: updatedTasks };
      }),

      moveTaskToCategory: (id, category) => set((state) => ({
        tasks: state.tasks.map(task => task.id === id
          ? { ...task, gtdCategory: category, updatedAt: new Date() }
          : task
        )
      })),

      addProject: (projectData) => set((state) => ({
        projects: [...state.projects, {
          ...projectData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }]
      })),

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project => project.id === id
          ? { ...project, ...updates, updatedAt: new Date() }
          : project
        )
      })),

      getTasksByCategory: (category) => {
        return get().tasks.filter(task => task.gtdCategory === category);
      },

      getTasksByQuadrant: (quadrant) => {
        return get().tasks.filter(task => task.eisenhowerQuadrant === quadrant);
      },

      getHighPriorityTasks: () => {
        const tasks = get().tasks;
        
        // Sort by priority (high first)
        return [...tasks].sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }).slice(0, 10);
      },

      getTasksByContext: (context) => {
        return get().tasks.filter(task => task.context?.toLowerCase().includes(context.toLowerCase())
        );
      },

      getTasksByEnergy: (energy) => {
        return get().tasks.filter(task => task.energy === energy);
      },

      createWeeklyReview: (reviewData) => set((state) => ({
        weeklyReviews: [...state.weeklyReviews, {
          ...reviewData,
          id: crypto.randomUUID(),
        }]
      })),

      getInboxCount: () => {
        return get().tasks.filter(task => task.gtdCategory === 'inbox').length;
      },

      getNextActionCount: () => {
        return get().tasks.filter(task => task.gtdCategory === 'next-action').length;
      },

      getWaitingCount: () => {
        return get().tasks.filter(task => task.gtdCategory === 'waiting').length;
      },
    }),
    {
      name: 'task-store',
      // Only persist essential data
      partialize: (state) => ({
        tasks: state.tasks,
        projects: state.projects,
        weeklyReviews: state.weeklyReviews,
      }),
    }
  )
);
