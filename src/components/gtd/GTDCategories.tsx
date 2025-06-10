// src/components/gtd/GTDCategories.tsx
import React, { useMemo } from 'react';
import { GTDCategory, GTDCategoryConfig, GTDStats } from '@/types/gtd';
import { Task } from '@/types/task';
import { GTDTask } from '@/types/task';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  ArrowRight, 
  Clock, 
  FolderOpen, 
  Archive, 
  CheckCircle,
  Plus,
  Filter
} from 'lucide-react';

interface GTDCategoriesProps {
    tasks: GTDTask[];
    onCategorySelect: (category: GTDCategory) => void;
    selectedCategory?: GTDCategory;
    onTaskMove: (taskId: string, newCategory: GTDTask['gtdCategory']) => void;
  }

const GTD_CATEGORIES: GTDCategoryConfig[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    description: 'Capture everything here first',
    icon: 'inbox',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    maxItems: 50
  },
  {
    id: 'next-action',
    name: 'Next Actions',
    description: 'Ready to do tasks',
    icon: 'arrow-right',
    color: 'bg-green-100 border-green-300 text-green-800'
  },
  {
    id: 'waiting',
    name: 'Waiting For',
    description: 'Waiting on others',
    icon: 'clock',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Multi-step outcomes',
    icon: 'folder-open',
    color: 'bg-purple-100 border-purple-300 text-purple-800'
  },
  {
    id: 'someday-maybe',
    name: 'Someday/Maybe',
    description: 'Future possibilities',
    icon: 'archive',
    color: 'bg-gray-100 border-gray-300 text-gray-800'
  },
  {
    id: 'completed',
    name: 'Completed',
    description: 'Done tasks',
    icon: 'check-circle',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-800'
  }
];

export const GTDCategories: React.FC<{
    tasks: GTDTask[];
    onCategorySelect: (category: GTDCategory) => void;
    selectedCategory?: GTDCategory;
    onTaskMove: (taskId: string, newCategory: GTDCategory) => void;
  }> = ({
    tasks,
    onCategorySelect,
    selectedCategory,
    onTaskMove,
  }) =>  {
  const categoryStats = useMemo(() => {
    const stats: Record<GTDCategory, GTDStats> = {} as Record<GTDCategory, GTDStats>;
    
    GTD_CATEGORIES.forEach(category => {
      const categoryTasks = tasks.filter(task => task.status === category.id);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      stats[category.id] = {
        category: category.id,
        count: categoryTasks.length,
        overdueCount: categoryTasks.filter(task => 
          task.deadline && new Date(task.deadline) < now
        ).length,
        completedToday: categoryTasks.filter(task => 
          task.status === 'completed' && 
          task.updatedAt >= today
        ).length
      };
    });
    
    return stats;
  }, [tasks]);

  const getIcon = (iconName: string) => {
    const icons = {
      'inbox': Inbox,
      'arrow-right': ArrowRight,
      'clock': Clock,
      'folder-open': FolderOpen,
      'archive': Archive,
      'check-circle': CheckCircle
    };
    return icons[iconName as keyof typeof icons] || Inbox;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">GTD Categories</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GTD_CATEGORIES.map((category) => {
          const stats = categoryStats[category.id];
          const IconComponent = getIcon(category.icon);
          const isSelected = selectedCategory === category.id;
          const isOverCapacity = category.maxItems && stats.count > category.maxItems;

          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              } ${category.color}`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    {category.name}
                  </div>
                  <Badge variant="secondary">
                    {stats.count}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3 opacity-75">
                  {category.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {stats.overdueCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.overdueCount} overdue
                    </Badge>
                  )}
                  
                  {category.id === 'completed' && stats.completedToday > 0 && (
                    <Badge variant="default" className="text-xs bg-green-500">
                      {stats.completedToday} today
                    </Badge>
                  )}
                  
                  {isOverCapacity && (
                    <Badge variant="outline" className="text-xs text-orange-600">
                      Review needed
                    </Badge>
                  )}
                </div>

                {category.maxItems && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Capacity</span>
                      <span>{stats.count}/{category.maxItems}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          isOverCapacity ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (stats.count / category.maxItems) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {categoryStats.inbox.count}
              </div>
              <div className="text-sm text-gray-600">In Inbox</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {categoryStats['next-action'].count}
              </div>
              <div className="text-sm text-gray-600">Next Actions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {categoryStats.waiting.count}
              </div>
              <div className="text-sm text-gray-600">Waiting</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {categoryStats.completed.completedToday}
              </div>
              <div className="text-sm text-gray-600">Done Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};