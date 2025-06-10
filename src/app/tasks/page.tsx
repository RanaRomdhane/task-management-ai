'use client';

import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Navigation from '@/components/layout/Navigation';
import TaskForm from '@/components/forms/TaskForm';
import BulkTaskImport from '@/components/forms/BulkTaskImport';
import { ContextFilter } from '@/components/gtd/ContextFilter';import EisenhowerMatrix from '@/components/gtd/EisenhowerMatrix';
import PriorityDashboard from '@/components/gtd/PriorityDashboard';
import { GTDCategories } from '@/components/gtd/GTDCategories';
import { WeeklyReview } from '@/components/gtd/WeeklyReview';
import { ProjectBreakdown } from '@/components/gtd/ProjectBreakdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Filter, List, Target, FolderOpen, CalendarDays, Clock, Calendar } from 'lucide-react';
import { useTaskStore } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GTDTask } from '@/types/task';
import { GTDCategory } from '@/types/gtd';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PriorityIndicator } from '@/components/priorities/PriorityIndicator';
import { calculateTaskPriority } from '@/lib/gtd-utils';
type TaskStatus = 'inbox' | 'next-action' | 'waiting' | 'completed';

export default function TasksPage() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GTDCategory | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined);
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();


  const handleCategorySelect = (category: GTDCategory) => {
    setSelectedCategory(category);
  };
  // Memoize unique projects
  const projects = useMemo(() => {
    return [...new Set(tasks.map((task) => task.projectId).filter(Boolean))] as string[];
  }, [tasks]);

  // Handlers
  const handleTaskUpdate = (taskId: string, updates: Partial<GTDTask>) => {
    updateTask(taskId, updates);
  };

  const handleTaskComplete = (taskId: string) => {
    updateTask(taskId, { status: 'completed' });
  };

  const handleTaskMove = (taskId: string, newCategory: GTDCategory) => {
    console.log('newCategory:', newCategory);
    updateTask(taskId, { gtdCategory: newCategory ?? 'projects' });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleAddNextAction = (action: Partial<GTDTask>) => {
    addTask({
      ...action,
      id: Math.random().toString(), // TODO: Replace with UUID
      createdAt: new Date(),
      updatedAt: new Date(),
      gtdCategory: 'next-action',
      energy: action.energy || 'medium',
    } as GTDTask);
  };

  const handleProjectUpdate = (projectName: string, updates: any) => {
    console.log(`Updating project ${projectName} with`, updates);
  };

  const handleReviewComplete = () => {
    console.log('Weekly review completed');
  };

  // Helper function for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'next-action': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-orange-100 text-orange-800';
      case 'inbox': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Memoize task list for rendering
  const memoizedTaskList = useMemo(() => {
    return tasks.map((task) => (
      <Card
        key={task.id}
        className="hover:shadow-md transition-shadow mb-3"
        role="menuitem"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            console.log(`Viewing details for ${task.title}`);
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{task.title}</h3>
              {task.description && <p className="text-gray-600 mb-3">{task.description}</p>}
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <PriorityIndicator
                priority={{
                  score: calculateTaskPriority(task),
                  category:
                    task.priority === 'high' ? 'critical' :
                    task.priority === 'medium' ? 'important' : 'low',
                  is8020Task: task.isHighImpact || false,
                  breakdown: {
                    deadlineScore: task.deadline ? 5 : 1,
                    importanceScore: task.priority === 'high' ? 9 : task.priority === 'medium' ? 6 : 3,
                    dependencyScore: task.dependencies?.length ? 5 : 0,
                    impactScore: task.isHighImpact ? 8 : 2,
                  },
                }}
                showBreakdown={false}
              />
              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            {task.estimatedDuration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {task.estimatedDuration} min
              </div>
            )}
            {task.deadline && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
              </div>
            )}
            {task.category && (
              <Badge variant="outline">{task.category}</Badge>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {task.status !== 'completed' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(task.id, 'completed')}
                  aria-label={`Mark ${task.title} as completed`}
                >
                  Mark Complete
                </Button>
              )}
              {task.status === 'inbox' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(task.id, 'next-action')}
                  aria-label={`Move ${task.title} to Next Actions`}
                >
                  Move to Next Actions
                </Button>
              )}
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteTask(task.id)}
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  }, [tasks, deleteTask]);

  return (
    <MainLayout>
      <Navigation />
      <div className="mt-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <div className="space-x-2">
            <Button
              onClick={() => setShowTaskForm(true)}
              aria-label="Create new task"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowBulkImport(true)}
              aria-label="Bulk import tasks"
            >
              Bulk Import
            </Button>
          </div>
        </div>

        {/* Modals */}
        {showTaskForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Task creation form"
          >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <TaskForm onClose={() => setShowTaskForm(false)} />
            </div>
          </div>
        )}
        {showBulkImport && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Bulk task import"
          >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <BulkTaskImport onClose={() => setShowBulkImport(false)} />
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="context-filter" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger value="context-filter" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Context Filter
            </TabsTrigger>
            <TabsTrigger value="task-list" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              Task List
            </TabsTrigger>
            <TabsTrigger value="priority" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Priority
            </TabsTrigger>
            <TabsTrigger value="eisenhower" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Eisenhower
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="weekly-review" className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              Weekly Review
            </TabsTrigger>
          </TabsList>

          {/* Context Filter */}
          <TabsContent value="context-filter">
            <ContextFilter
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskComplete={handleTaskComplete}
            />
          </TabsContent>

          {/* Task List */}
          <TabsContent value="task-list">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">No tasks yet. Create your first task!</p>
                  <Button onClick={() => setShowTaskForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">{memoizedTaskList}</div>
            )}
          </TabsContent>

          {/* Priority Dashboard */}
          <TabsContent value="priority">
            <PriorityDashboard />
          </TabsContent>

          {/* Eisenhower Matrix */}
          <TabsContent value="eisenhower">
            <EisenhowerMatrix />
          </TabsContent>

          {/* GTD Categories */}
          <TabsContent value="categories">
  <GTDCategories
    tasks={tasks}
    onCategorySelect={handleCategorySelect}
    selectedCategory={selectedCategory}
    onTaskMove={handleTaskMove}
  />
</TabsContent>

          {/* Weekly Review */}
          <TabsContent value="weekly-review">
            <WeeklyReview tasks={tasks} onReviewComplete={handleReviewComplete} />
          </TabsContent>
        </Tabs>

        {/* Projects Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Projects</h3>
            <Select
              onValueChange={setSelectedProject}
              value={selectedProject || ''}
              aria-label="Select project"
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedProject ? (
            <ProjectBreakdown
              project={selectedProject}
              tasks={tasks}
              onAddNextAction={handleAddNextAction}
              onProjectUpdate={handleProjectUpdate}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {projects.length > 0 ? 'Select a project to view details' : 'No projects yet. Create a task with a project!'}
                </p>
                <Button onClick={() => setShowTaskForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}