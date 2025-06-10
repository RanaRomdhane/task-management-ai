// src/types/gtd.ts
export type GTDCategory = 'inbox' | 'next-action' | 'waiting' | 'projects' | 'someday-maybe' | 'completed';

export interface GTDCategoryConfig {
  id: GTDCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxItems?: number;
}

export interface GTDStats {
  category: GTDCategory;
  count: number;
  overdueCount: number;
  completedToday: number;
}