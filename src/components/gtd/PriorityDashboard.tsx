'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskStore } from '@/lib/utils';
import { calculateTaskPriority, identifyHighImpactTasks } from "@/lib/gtd-utils";
import { Clock, AlertCircle, Target } from "lucide-react";

export default function PriorityDashboard() {
  const { tasks, getHighPriorityTasks } = useTaskStore();
  
  const highPriorityTasks = getHighPriorityTasks();
  const highImpactTasks = identifyHighImpactTasks(tasks);
  
  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'bg-red-500';
    if (priority >= 60) return 'bg-orange-500';
    if (priority >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getPriorityLabel = (priority: number) => {
    if (priority >= 80) return 'Critical';
    if (priority >= 60) return 'High';
    if (priority >= 40) return 'Medium';
    return 'Low';
  };
  
  const TaskPriorityCard = ({ task }: { task: any }) => {
    const priority = calculateTaskPriority(task);
    
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm">{task.title}</h4>
            <Badge 
              variant="secondary" 
              className={`text-white ${getPriorityColor(priority)}`}
            >
              {getPriorityLabel(priority)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Progress value={priority} className="h-2" />
            
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              {task.deadline && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
              )}
              
              {task.isUrgent && (
                <div className="flex items-center text-red-500">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Urgent
                </div>
              )}
              
              {task.isImportant && (
                <div className="flex items-center text-blue-500">
                  <Target className="w-3 h-3 mr-1" />
                  Important
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400">
              Priority Score: {priority}/100
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Priority Dashboard</h2>
        <div className="text-sm text-gray-500">
          Based on weighted scoring algorithm
        </div>
      </div>
      
      <Tabs defaultValue="high-priority" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="high-priority">High Priority</TabsTrigger>
          <TabsTrigger value="high-impact">80/20 Rule</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
        </TabsList>
        
        <TabsContent value="high-priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Priority Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {highPriorityTasks.length > 0 ? (
                <div className="space-y-2">
                  {highPriorityTasks.slice(0, 10).map(task => (
                    <TaskPriorityCard key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No high priority tasks found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="high-impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">High Impact Tasks (80/20 Rule)</CardTitle>
              <p className="text-sm text-gray-500">
                Focus on these {Math.ceil(tasks.length * 0.2)} tasks for maximum impact
              </p>
            </CardHeader>
            <CardContent>
              {highImpactTasks.length > 0 ? (
                <div className="space-y-2">
                  {highImpactTasks.map(task => (
                    <TaskPriorityCard key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Add more tasks to see high impact recommendations
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="algorithm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Algorithm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Scoring Weights:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Deadline proximity: 40%</li>
                    <li>• Eisenhower Matrix: 30%</li>
                    <li>• Dependencies: 20%</li>
                    <li>• Energy vs Time: 10%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Priority Levels:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                      Critical (80-100)
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                      High (60-79)
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                      Medium (40-59)
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                      Low (0-39)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}