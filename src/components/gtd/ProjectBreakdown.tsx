// src/components/gtd/ProjectBreakdown.tsx
import React, { useState } from 'react';
import { Task } from '@/types/priority';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, ArrowRight, Trash2, Lightbulb, Clock, CheckCircle } from 'lucide-react';

interface ProjectBreakdownProps {
  project: string;
  tasks: Task[];
  onAddNextAction: (action: Partial<Task>) => void;
  onProjectUpdate: (projectName: string, updates: any) => void;
}

interface NextAction {
  id: string;
  title: string;
  context: string;
  estimatedDuration: number;
}

export const ProjectBreakdown: React.FC<ProjectBreakdownProps> = ({
  project,
  tasks,
  onAddNextAction,
  onProjectUpdate
}) => {
  const [newAction, setNewAction] = useState<Partial<NextAction>>({
    title: '',
    context: '',
    estimatedDuration: 30
  });
  const [projectOutcome, setProjectOutcome] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const projectTasks = tasks.filter(task => task.project === project);
  const nextActions = projectTasks.filter(task => task.status === 'next-action');
  const completedActions = projectTasks.filter(task => task.status === 'completed');
  
  const contexts = [...new Set(projectTasks.map(task => task.context).filter(Boolean))];

  const addNextAction = () => {
    if (!newAction.title) return;

    onAddNextAction({
      title: newAction.title,
      context: newAction.context,
      estimatedDuration: newAction.estimatedDuration || 30,
      project: project,
      status: 'next-action',
      priority: 'medium',
      category: 'action',
      dependencies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setNewAction({
      title: '',
      context: '',
      estimatedDuration: 30
    });
  };

  const suggestNextActions = () => {
    // Simple AI-like suggestions based on project type and existing tasks
    const commonSuggestions = [
      'Schedule project kickoff meeting',
      'Research and gather requirements',
      'Create project timeline',
      'Identify key stakeholders',
      'Set up project workspace',
      'Define success criteria',
      'Allocate necessary resources',
      'Create communication plan'
    ];

    const contextBasedSuggestions = {
      'computer': [
        'Set up development environment',
        'Create repository structure',
        'Install necessary software',
        'Configure tools and settings'
      ],
      'phone': [
        'Schedule initial call',
        'Contact team members',
        'Confirm meeting times',
        'Follow up on pending items'
      ],
      'office': [
        'Book meeting room',
        'Print necessary documents',
        'Organize physical materials',
        'Schedule face-to-face meetings'
      ]
    };

    const existingContexts = new Set(projectTasks.map(t => t.context).filter(Boolean));
    let suggestions = [...commonSuggestions];

    existingContexts.forEach(context => {
      if (contextBasedSuggestions[context as keyof typeof contextBasedSuggestions]) {
        suggestions.push(...contextBasedSuggestions[context as keyof typeof contextBasedSuggestions]);
      }
    });

    // Filter out suggestions that are similar to existing tasks
    const existingTitles = projectTasks.map(t => t.title.toLowerCase());
    suggestions = suggestions.filter(suggestion => 
      !existingTitles.some(title => 
        title.includes(suggestion.toLowerCase().split(' ')[0]) ||
        suggestion.toLowerCase().includes(title.split(' ')[0])
      )
    );

    return suggestions.slice(0, 6);
  };

  const addSuggestedAction = (suggestion: string) => {
    setNewAction(prev => ({
      ...prev,
      title: suggestion
    }));
    setShowSuggestions(false);
  };

  const calculateProjectProgress = () => {
    if (projectTasks.length === 0) return 0;
    return Math.round((completedActions.length / projectTasks.length) * 100);
  };

  const estimateProjectTime = () => {
    const remainingTime = nextActions.reduce((total, action) => 
      total + (action.estimatedDuration || 30), 0
    );
    return remainingTime;
  };

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {project}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{nextActions.length}</div>
              <div className="text-sm text-gray-600">Next Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{calculateProjectProgress()}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.ceil(estimateProjectTime() / 60)}h</div>
              <div className="text-sm text-gray-600">Est. Remaining</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Project Outcome</label>
              <Textarea
                placeholder="What does success look like for this project?"
                value={projectOutcome}
                onChange={(e) => setProjectOutcome(e.target.value)}
                onBlur={() => onProjectUpdate(project, { outcome: projectOutcome })}
                className="resize-none"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Next Action */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Next Action
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              Suggestions
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showSuggestions && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Suggested Next Actions:</h4>
              <div className="flex flex-wrap gap-2">
                {suggestNextActions().map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => addSuggestedAction(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Input
              placeholder="What's the next physical action?"
              value={newAction.title || ''}
              onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && addNextAction()}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Context</label>
                <Input
                  placeholder="@phone, @computer, @office"
                  value={newAction.context || ''}
                  onChange={(e) => setNewAction(prev => ({ ...prev, context: e.target.value }))}
                  list="contexts"
                />
                <datalist id="contexts">
                  {contexts.map(context => (
                    <option key={context} value={context} />
                  ))}
                  <option value="@phone" />
                  <option value="@computer" />
                  <option value="@office" />
                  <option value="@home" />
                  <option value="@errands" />
                </datalist>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Duration (min)</label>
                <Input
                  type="number"
                  placeholder="30"
                  value={newAction.estimatedDuration || ''}
                  onChange={(e) => setNewAction(prev => ({ 
                    ...prev, 
                    estimatedDuration: parseInt(e.target.value) || 30 
                  }))}
                />
              </div>
            </div>

            <Button onClick={addNextAction} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Next Action
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Next Actions */}
      {nextActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Next Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextActions.map(action => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{action.title}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      {action.context && (
                        <span className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {action.context}
                          </Badge>
                        </span>
                      )}
                      {action.estimatedDuration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {action.estimatedDuration}min
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Actions */}
      {completedActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Completed Actions ({completedActions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedActions.slice(0, 5).map(action => (
                <div key={action.id} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="line-through">{action.title}</span>
                </div>
              ))}
              {completedActions.length > 5 && (
                <div className="text-sm text-gray-500 italic">
                  ... and {completedActions.length - 5} more completed actions
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};