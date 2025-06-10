'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTaskStore } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function BulkTaskImport({ onClose }: { onClose?: () => void }) {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null)
  const addTask = useTaskStore((state) => state.addTask)

  const processBulkInput = () => {
    setIsProcessing(true)
    const lines = input.split('\n').filter(line => line.trim())
    const errors: string[] = []
    let successCount = 0

    lines.forEach((line, index) => {
      try {
        // Support different formats:
        // "Task title"
        // "Task title | category | priority | duration"
        // "Task title, category, priority, duration"
        
        const parts = line.includes('|') 
          ? line.split('|').map(p => p.trim())
          : line.includes(',')
          ? line.split(',').map(p => p.trim())
          : [line.trim()]

        const title = parts[0]
        if (!title) {
          errors.push(`Line ${index + 1}: Empty title`)
          return
        }

        const category = parts[1] || 'work'
        const priority = (parts[2] as 'high' | 'medium' | 'low') || 'medium'
        const duration = parseInt(parts[3]) || 30

        // Validate priority
        if (!['high', 'medium', 'low'].includes(priority)) {
          errors.push(`Line ${index + 1}: Invalid priority '${priority}'. Use: high, medium, or low`)
          return
        }

        // Validate duration
        if (isNaN(duration) || duration < 5 || duration > 480) {
          errors.push(`Line ${index + 1}: Invalid duration '${duration}'. Must be between 5-480 minutes`)
          return
        }

        addTask({
          title,
          description: '',
          category,
          priority,
          estimatedDuration: duration,
          dependencies: [],
          status: 'inbox',
          gtdCategory: 'inbox',
          isUrgent: false,
          isImportant: false,
          energy: 'medium',
        })
        
        successCount++
      } catch (error) {
        errors.push(`Line ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    })

    setResults({ success: successCount, errors })
    setIsProcessing(false)
    
    if (errors.length === 0) {
      setTimeout(() => {
        onClose?.()
      }, 2000)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bulk Import Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Enter tasks one per line. You can use these formats:
          </p>
          <div className="text-xs text-gray-500 space-y-1 mb-4">
            <div>• Simple: "Task title"</div>
            <div>• With details: "Task title | category | priority | duration"</div>
            <div>• CSV format: "Task title, work, high, 60"</div>
            <div>• Priority: high, medium, low</div>
            <div>• Duration: 5-480 minutes</div>
          </div>
        </div>

        <Textarea
          placeholder={`Review project requirements
Prepare client presentation | meetings | high | 90
Send follow-up emails, admin, medium, 30
Update documentation`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />

        {results && (
          <Alert className={results.errors.length > 0 ? 'border-yellow-500' : 'border-green-500'}>
            <AlertDescription>
              <div className="font-medium mb-2">
                Import Results: {results.success} tasks created successfully
              </div>
              {results.errors.length > 0 && (
                <div className="text-sm text-red-600">
                  <div className="font-medium">Errors:</div>
                  <ul className="list-disc list-inside">
                    {results.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button 
            onClick={processBulkInput}
            disabled={!input.trim() || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Import Tasks'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}