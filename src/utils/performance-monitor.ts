// utils/performance-monitor.ts
export class PerformanceMonitor {
    private metrics: Map<string, number[]> = new Map()
    
    startTiming(operation: string): () => void {
      const startTime = performance.now()
      
      return () => {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (!this.metrics.has(operation)) {
          this.metrics.set(operation, [])
        }
        
        this.metrics.get(operation)!.push(duration)
        
        // Log slow operations
        if (duration > 100) {
          console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`)
        }
      }
    }
    
    getAverageTime(operation: string): number {
      const times = this.metrics.get(operation) || []
      return times.length > 0 ? times.reduce((a, b) => a + b) / times.length : 0
    }
    
    getMetricsReport(): Record<string, { avg: number, max: number, count: number }> {
      const report: Record<string, { avg: number, max: number, count: number }> = {}
      
      this.metrics.forEach((times, operation) => {
        report[operation] = {
          avg: this.getAverageTime(operation),
          max: Math.max(...times),
          count: times.length
        }
      })
      
      return report
    }
  }
  
  export const performanceMonitor = new PerformanceMonitor()