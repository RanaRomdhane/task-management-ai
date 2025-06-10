'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from '@/lib/utils';
import { EISENHOWER_QUADRANTS } from "@/lib/gtd-constants";
import { GTDTask } from "@/types/task";

export default function EisenhowerMatrix() {
  const { tasks } = useTaskStore();
  
  const getTasksForQuadrant = (quadrant: keyof typeof EISENHOWER_QUADRANTS) => {
    return tasks.filter(task => task.eisenhowerQuadrant === quadrant);
  };
  
  const QuadrantCard = ({ 
    quadrant, 
    tasks 
  }: { 
    quadrant: keyof typeof EISENHOWER_QUADRANTS; 
    tasks: GTDTask[] 
  }) => {
    const config = EISENHOWER_QUADRANTS[quadrant];
    
    return (
      <Card className="h-64 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>{config.label}</span>
            <Badge variant="secondary">{tasks.length}</Badge>
          </CardTitle>
          <p className="text-xs text-gray-500">{config.description}</p>
        </CardHeader>
        <CardContent className="overflow-y-auto h-40">
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div 
                key={task.id}
                className="p-2 bg-gray-50 rounded text-xs hover:bg-gray-100 cursor-pointer"
                onClick={() => {/* TODO: Open task details */}}
              >
                <div className="font-medium truncate">{task.title}</div>
                <div className="text-gray-500 text-xs">
                  {task.deadline && new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
            {tasks.length > 5 && (
              <div className="text-xs text-gray-500 text-center">
                +{tasks.length - 5} more tasks
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Eisenhower Matrix</h2>
      <div className="grid grid-cols-2 gap-4">
        <QuadrantCard 
          quadrant="urgent-important" 
          tasks={getTasksForQuadrant('urgent-important')} 
        />
        <QuadrantCard 
          quadrant="important-not-urgent" 
          tasks={getTasksForQuadrant('important-not-urgent')} 
        />
        <QuadrantCard 
          quadrant="urgent-not-important" 
          tasks={getTasksForQuadrant('urgent-not-important')} 
        />
        <QuadrantCard 
          quadrant="not-urgent-not-important" 
          tasks={getTasksForQuadrant('not-urgent-not-important')} 
        />
      </div>
    </div>
  );
}