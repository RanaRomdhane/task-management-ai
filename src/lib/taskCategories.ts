export const TASK_CATEGORIES = [
    { value: 'work', label: '💼 Work', description: 'Professional tasks and projects' },
    { value: 'personal', label: '👤 Personal', description: 'Personal life and self-care' },
    { value: 'urgent', label: '⚡ Urgent', description: 'Time-sensitive tasks' },
    { value: 'meetings', label: '👥 Meetings', description: 'Scheduled meetings and calls' },
    { value: 'development', label: '💻 Development', description: 'Coding and technical work' },
    { value: 'research', label: '📚 Research', description: 'Learning and investigation' },
    { value: 'admin', label: '📋 Administrative', description: 'Paperwork and admin tasks' },
    { value: 'creative', label: '🎨 Creative', description: 'Design and creative work' },
    { value: 'health', label: '🏥 Health', description: 'Health and wellness tasks' },
    { value: 'finance', label: '💰 Finance', description: 'Financial and budget tasks' },
  ] as const
  
  export const PRIORITY_OPTIONS = [
    { value: 'high', label: '🔴 High', description: 'Critical and urgent' },
    { value: 'medium', label: '🟡 Medium', description: 'Important but not urgent' },
    { value: 'low', label: '🟢 Low', description: 'Nice to have' },
  ] as const
  
  export const DURATION_PRESETS = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: '4 hours', value: 240 },
    { label: 'Full day', value: 480 },
  ] as const