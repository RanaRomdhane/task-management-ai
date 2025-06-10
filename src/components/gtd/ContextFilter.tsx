// src/components/gtd/ContextFilter.tsx
import React, { useState, useMemo } from 'react';
import { Task } from '@/types/priority';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox, type CheckedState } from '@/components/ui/checkbox';
import { 
  Smartphone, 
  Monitor, 
  Building2, 
  Home, 
  Car, 
  Users, 
  Clock, 
  Filter,
  Search,
  MapPin,
  Zap
} from 'lucide-react';

interface ContextFilterProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskComplete: (taskId: string) => void;
}

interface ContextGroup {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  tasks: Task[];
  totalTime: number;
}

const CONTEXT_ICONS = {
  '@phone': Smartphone,
  '@computer': Monitor,
  '@office': Building2,
  '@home': Home,
  '@errands': Car,
  '@meeting': Users,
  '@waiting': Clock,
  '@anywhere': MapPin,
  '@energy-high': Zap,
  '@energy-low': Clock
};

const CONTEXT_COLORS = {
  '@phone': 'bg-blue-100 text-blue-800 border-blue-200',
  '@computer': 'bg-purple-100 text-purple-800 border-purple-200',
  '@office': 'bg-gray-100 text-gray-800 border-gray-200',
  '@home': 'bg-green-100 text-green-800 border-green-200',
  '@errands': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  '@meeting': 'bg-red-100 text-red-800 border-red-200',
  '@waiting': 'bg-orange-100 text-orange-800 border-orange-200',
  '@anywhere': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  '@energy-high': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  '@energy-low': 'bg-slate-100 text-slate-800 border-slate-200'
};

export const ContextFilter: React.FC<ContextFilterProps> = ({
  tasks,
  onTaskUpdate,
  onTaskComplete
}) => {
  const [selectedContext, setSelectedContext] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyNextActions, setShowOnlyNextActions] = useState<boolean>(true);
      const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low' | 'any'>('any');
  const [timeAvailable, setTimeAvailable] = useState<number>(60);

  const contextGroups = useMemo(() => {
    const groups: Record<string, ContextGroup> = {};
    
    // Filter tasks based on criteria
    let filteredTasks = tasks.filter(task => {
      if (showOnlyNextActions && task.status !== 'next-action') return false;
      if (task.status === 'completed') return false;
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

    // Group by context
    filteredTasks.forEach(task => {
      const context = task.context || '@anywhere';
      if (!groups[context]) {
        groups[context] = {
          name: context,
          icon: CONTEXT_ICONS[context as keyof typeof CONTEXT_ICONS] || MapPin,
          color: CONTEXT_COLORS[context as keyof typeof CONTEXT_COLORS] || 'bg-gray-100 text-gray-800',
          tasks: [],
          totalTime: 0
        };
      }
      groups[context].tasks.push(task);
      groups[context].totalTime += task.estimatedDuration || 30;
    });

    // Filter by energy level
    if (energyLevel !== 'any') {
      Object.keys(groups).forEach(context => {
        groups[context].tasks = groups[context].tasks.filter(task => {
          const taskEnergy = getTaskEnergyLevel(task);
          return taskEnergy === energyLevel;
        });
        groups[context].totalTime = groups[context].tasks.reduce(
          (total, task) => total + (task.estimatedDuration || 30), 0
        );
      });
    }

    // Filter by available time
    Object.keys(groups).forEach(context => {
      groups[context].tasks = groups[context].tasks.filter(
        task => (task.estimatedDuration || 30) <= timeAvailable
      );
    });

    // Remove empty groups
    Object.keys(groups).forEach(context => {
      if (groups[context].tasks.length === 0) {
        delete groups[context];
      }
    });

    return groups;
  }, [tasks, searchTerm, showOnlyNextActions, energyLevel, timeAvailable]);

  const getTaskEnergyLevel = (task: Task): 'high' | 'medium' | 'low' => {
    if (task.context?.includes('energy-high')) return 'high';
    if (task.context?.includes('energy-low')) return 'low';
    
    // Determine energy based on task characteristics
    const duration = task.estimatedDuration || 30;
    const isCreative = task.title.toLowerCase().includes('create') || 
                      task.title.toLowerCase().includes('design') ||
                      task.title.toLowerCase().includes('write');
    const isRoutine = task.title.toLowerCase().includes('review') ||
                     task.title.toLowerCase().includes('organize') ||
                     task.title.toLowerCase().includes('file');

    if (isCreative || duration > 120) return 'high';
    if (isRoutine || duration < 15) return 'low';
    return 'medium';
  };

  const getTasksByTime = (minutes: number) => {
    const allTasks = Object.values(contextGroups).flatMap(group => group.tasks);
    return allTasks.filter(task => (task.estimatedDuration || 30) <= minutes);
  };

  const getHighPriorityTasks = () => {
    const allTasks = Object.values(contextGroups).flatMap(group => group.tasks);
    return allTasks.filter(task => task.priority === 'high');
  };

  const filteredContexts = selectedContext === 'all' 
    ? Object.values(contextGroups)
    : Object.values(contextGroups).filter(group => group.name === selectedContext);

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Context-Based Task Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Show Only</label>
                <div className="flex items-center space-x-2">
                <Checkbox
  id="next-actions"
  checked={showOnlyNextActions}
  onCheckedChange={(checked) => setShowOnlyNextActions(!!checked)}
/>
                  <label htmlFor="next-actions" className="text-sm">Next Actions</label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Energy Level</label>
                <select
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(e.target.value as any)}
                  className="w-full px-3 py-1 border rounded text-sm"
                >
                  <option value="any">Any</option>
                  <option value="high">High Energy</option>
                  <option value="medium">Medium Energy</option>
                  <option value="low">Low Energy</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Available</label>
                <select
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(parseInt(e.target.value))}
                  className="w-full px-3 py-1 border rounded text-sm"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={999}>Any duration</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Actions</label>
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setTimeAvailable(15);
                      setEnergyLevel('low');
                    }}
                  >
                    Quick Wins
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Context Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Button
              variant={selectedContext === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedContext('all')}
              className="justify-start"
            >
              All Contexts ({Object.values(contextGroups).reduce((sum, g) => sum + g.tasks.length, 0)})
            </Button>
            {Object.entries(contextGroups).map(([contextName, group]) => {
              const IconComponent = group.icon;
              return (
                <Button
                  key={contextName}
                  variant={selectedContext === contextName ? 'default' : 'outline'}
                  onClick={() => setSelectedContext(contextName)}
                  className="justify-start"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {contextName} ({group.tasks.length})
                </Button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{getTasksByTime(15).length}</div>
              <div className="text-xs text-gray-600">≤15 min tasks</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{getTasksByTime(30).length}</div>
              <div className="text-xs text-gray-600">≤30 min tasks</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{getHighPriorityTasks().length}</div>
              <div className="text-xs text-gray-600">High priority</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(Object.values(contextGroups).reduce((sum, g) => sum + g.totalTime, 0) / 60)}h
              </div>
              <div className="text-xs text-gray-600">Total time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Groups */}
      {filteredContexts.map(group => (
        <Card key={group.name}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <group.icon className="w-5 h-5" />
                {group.name}
                <Badge variant="secondary">{group.tasks.length} tasks</Badge>
              </div>
              <div className="text-sm text-gray-600">
                {Math.round(group.totalTime / 60)}h {group.totalTime % 60}m
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => onTaskComplete(task.id)}
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${CONTEXT_COLORS[task.context as keyof typeof CONTEXT_COLORS] || 'bg-gray-100'}`}
                        >
                          {task.context || '@anywhere'}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedDuration || 30}min
                        </span>
                        {task.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getTaskEnergyLevel(task)} energy
                        </Badge>
                      </div>
                      {task.project && (
                        <div className="text-xs text-gray-500 mt-1">
                          Project: {task.project}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {group.tasks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No tasks match your current filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {Object.keys(contextGroups).length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more tasks.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};