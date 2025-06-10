'use client'

import React, { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import Navigation from '@/components/layout/Navigation'
import TaskForm from '@/components/forms/TaskForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTaskStore } from '@/lib/utils'
import { Plus, Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function TasksPage() {
  const [showForm, setShowForm] = useState(false)
  const tasks = useTaskStore((state) => state.tasks)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const updateTask = useTaskStore((state) => state.updateTask)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'next-action': return 'bg-blue-100 text-blue-800'
      case 'waiting': return 'bg-orange-100 text-orange-800'
      case 'inbox': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus as any })
  }

  return (
    <MainLayout>
      <Navigation />
      
      <div className="mt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <TaskForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No tasks yet. Create your first task!</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {task.estimatedDuration} min
                    </div>
                    {task.deadline && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
                      </div>
                    )}
                    <Badge variant="outline">{task.category}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {task.status !== 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                      {task.status === 'inbox' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(task.id, 'next-action')}
                        >
                          Move to Next Actions
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  )
}