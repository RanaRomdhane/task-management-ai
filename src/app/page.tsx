'use client';
import MainLayout from '@/components/layout/MainLayout'
import Navigation from '@/components/layout/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTaskStore } from '@/lib/utils'
import { Clock, CheckCircle, List, Target } from 'lucide-react'
import PriorityDashboard from '@/components/gtd/PriorityDashboard'
import EisenhowerMatrix from '@/components/gtd/EisenhowerMatrix'

export default function Home() {
  const { tasks } = useTaskStore()
  
  const stats = {
    totalTasks: tasks.length,
    completedToday: tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.updatedAt).toDateString() === new Date().toDateString()
    ).length,
    highPriority: tasks.filter(task => task.priority === 'high').length,
    nextActions: tasks.filter(task => task.status === 'next-action').length
  }

  return (
    <MainLayout>
      <Navigation />
      <div className="mt-8 px-4 max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalTasks}</p>
                </div>
                <List className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Today</p>
                  <p className="text-2xl font-bold mt-1">{stats.completedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">High Priority</p>
                  <p className="text-2xl font-bold mt-1">{stats.highPriority}</p>
                </div>
                <Target className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Next Actions</p>
                  <p className="text-2xl font-bold mt-1">{stats.nextActions}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Dashboard */}
        <PriorityDashboard />
        
        {/* Eisenhower Matrix */}
        <EisenhowerMatrix />
      </div>
    </MainLayout>
  )
}