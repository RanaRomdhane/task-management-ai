// src/components/gtd/WeeklyReview.tsx
import React, { useState, useMemo } from 'react';
import { Task } from '@/types/priority';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, CheckCircle, Target, TrendingUp } from 'lucide-react';

interface WeeklyReviewProps {
  tasks: Task[];
  onReviewComplete: () => void;
}

interface ReviewItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'inbox' | 'projects' | 'actions' | 'calendar' | 'reflection';
}

export const WeeklyReview: React.FC<WeeklyReviewProps> = ({ tasks, onReviewComplete }) => {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([
    // Inbox Processing
    { id: 'inbox-empty', title: 'Empty Inbox', description: 'Process all inbox items', completed: false, category: 'inbox' },
    { id: 'inbox-capture', title: 'Capture Everything', description: 'Add any missed items to inbox', completed: false, category: 'inbox' },
    
    // Project Review
    { id: 'projects-review', title: 'Review All Projects', description: 'Check each project for next actions', completed: false, category: 'projects' },
    { id: 'projects-stalled', title: 'Identify Stalled Projects', description: 'Find projects without next actions', completed: false, category: 'projects' },
    
    // Next Actions
    { id: 'actions-context', title: 'Organize by Context', description: 'Group actions by location/tool', completed: false, category: 'actions' },
    { id: 'actions-priority', title: 'Set Priorities', description: 'Identify most important actions', completed: false, category: 'actions' },
    
    // Calendar
    { id: 'calendar-week', title: 'Review Upcoming Week', description: 'Check calendar for next 7 days', completed: false, category: 'calendar' },
    { id: 'calendar-deadlines', title: 'Check Deadlines', description: 'Review all upcoming deadlines', completed: false, category: 'calendar' },
    
    // Reflection
    { id: 'reflection-wins', title: 'Celebrate Wins', description: 'Note what went well this week', completed: false, category: 'reflection' },
    { id: 'reflection-improve', title: 'Areas to Improve', description: 'Identify what could be better', completed: false, category: 'reflection' }
  ]);

  const reviewStats = useMemo(() => {
    const stats = {
      inbox: tasks.filter(t => t.status === 'inbox').length,
      projects: new Set(tasks.filter(t => t.project).map(t => t.project)).size,
      nextActions: tasks.filter(t => t.status === 'next-action').length,
      overdue: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date()).length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
    return stats;
  }, [tasks]);

  const completionRate = useMemo(() => {
    const completed = reviewItems.filter(item => item.completed).length;
    return (completed / reviewItems.length) * 100;
  }, [reviewItems]);

  const toggleReviewItem = (id: string) => {
    setReviewItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const categoryGroups = useMemo(() => {
    return reviewItems.reduce((groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    }, {} as Record<string, ReviewItem[]>);
  }, [reviewItems]);

  const categoryTitles = {
    inbox: 'Inbox Processing',
    projects: 'Project Review',
    actions: 'Next Actions',
    calendar: 'Calendar Review',
    reflection: 'Weekly Reflection'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Weekly Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Review Progress</span>
              <span className="text-sm text-gray-600">
                {reviewItems.filter(i => i.completed).length} of {reviewItems.length} completed
              </span>
            </div>
            <Progress value={completionRate} className="w-full" />
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{reviewStats.inbox}</div>
              <div className="text-xs text-gray-600">Inbox Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{reviewStats.projects}</div>
              <div className="text-xs text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{reviewStats.nextActions}</div>
              <div className="text-xs text-gray-600">Next Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{reviewStats.overdue}</div>
              <div className="text-xs text-gray-600">Overdue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{reviewStats.completed}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Checklist */}
      {Object.entries(categoryGroups).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">
              {categoryTitles[category as keyof typeof categoryTitles]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <Checkbox
                    id={item.id}
                    checked={item.completed}
                    onCheckedChange={() => toggleReviewItem(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={item.id}
                      className={`cursor-pointer block font-medium ${
                        item.completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {item.title}
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Complete Review */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Button 
              onClick={onReviewComplete}
              disabled={completionRate < 100}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {completionRate === 100 ? 'Complete Weekly Review' : `Complete Review (${Math.round(completionRate)}%)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};