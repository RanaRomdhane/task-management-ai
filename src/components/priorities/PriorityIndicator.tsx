// src/components/priority/PriorityIndicator.tsx
import React from 'react';
import { TaskPriority } from '@/types/priority';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, AlertTriangle, Clock, Users } from 'lucide-react';

interface PriorityIndicatorProps {
  priority: TaskPriority;
  showBreakdown?: boolean;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ 
  priority, 
  showBreakdown = false 
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'critical': return 'bg-red-500 text-white';
      case 'important': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {priority.is8020Task && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>High-Impact Task (80/20 Rule)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <Badge className={getCategoryColor(priority.category)}>
        {priority.category.toUpperCase()}
      </Badge>
      
      <span className="text-sm font-medium">
        {priority.score}/10
      </span>

      {showBreakdown && (
        <div className="ml-2 flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Clock className="w-3 h-3 text-blue-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Deadline Score: {priority.breakdown.deadlineScore}/10</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="w-3 h-3 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Importance Score: {priority.breakdown.importanceScore}/10</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Users className="w-3 h-3 text-green-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Dependency Score: {priority.breakdown.dependencyScore}/10</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};