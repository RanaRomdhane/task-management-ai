export const GTD_CATEGORIES = {
    inbox: {
      label: 'Inbox',
      description: 'New, unprocessed items',
      color: 'gray',
      icon: '📥'
    },
    'next-action': {
      label: 'Next Actions',
      description: 'Tasks you can do now',
      color: 'blue',
      icon: '⚡'
    },
    waiting: {
      label: 'Waiting For',
      description: 'Tasks blocked by others',
      color: 'yellow',
      icon: '⏳'
    },
    project: {
      label: 'Projects',
      description: 'Multi-step outcomes',
      color: 'green',
      icon: '📋'
    },
    'someday-maybe': {
      label: 'Someday/Maybe',
      description: 'Future possibilities',
      color: 'purple',
      icon: '💭'
    },
    reference: {
      label: 'Reference',
      description: 'Information to keep',
      color: 'indigo',
      icon: '📚'
    }
  } as const;
  
  export const EISENHOWER_QUADRANTS = {
    'urgent-important': {
      label: 'Do First',
      description: 'Urgent and Important',
      color: 'red',
      priority: 1
    },
    'important-not-urgent': {
      label: 'Schedule',
      description: 'Important but Not Urgent',
      color: 'orange',
      priority: 2
    },
    'urgent-not-important': {
      label: 'Delegate',
      description: 'Urgent but Not Important',
      color: 'yellow',
      priority: 3
    },
    'not-urgent-not-important': {
      label: 'Eliminate',
      description: 'Neither Urgent nor Important',
      color: 'gray',
      priority: 4
    }
  } as const;
  
  export const CONTEXTS = [
    '@home',
    '@office',
    '@computer',
    '@phone',
    '@errands',
    '@anywhere'
  ];
  
  export const ENERGY_LEVELS = {
    high: { label: 'High Energy', color: 'green' },
    medium: { label: 'Medium Energy', color: 'yellow' },
    low: { label: 'Low Energy', color: 'blue' }
  };