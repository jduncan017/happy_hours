/**
 * Performance monitoring utilities for tracking app performance
 * Includes Web Vitals and custom metrics specific to HappyHourHunt
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface FilterPerformanceMetric extends PerformanceMetric {
  name: 'filter_performance';
  metadata: {
    restaurantCount: number;
    filterType: string;
    durationMs: number;
  };
}

interface MapPerformanceMetric extends PerformanceMetric {
  name: 'map_render_performance';
  metadata: {
    markerCount: number;
    renderDurationMs: number;
  };
}

type CustomMetric = FilterPerformanceMetric | MapPerformanceMetric;

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean;

  constructor() {
    // Enable in development and production, but allow disabling via env var
    this.isEnabled = typeof window !== 'undefined' && 
                    process.env.NODE_ENV !== 'test' &&
                    process.env.NEXT_PUBLIC_DISABLE_PERFORMANCE_MONITORING !== 'true';
  }

  /**
   * Track custom application metrics
   */
  trackCustomMetric(metric: CustomMetric): void {
    if (!this.isEnabled) return;

    this.metrics.push({
      ...metric,
      timestamp: Date.now(),
    });

    // In a real app, you'd send this to an analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metric:', metric);
    }
  }

  /**
   * Measure and track restaurant filtering performance
   */
  trackFilterPerformance(restaurantCount: number, filterType: string): {
    end: () => void;
  } {
    if (!this.isEnabled) return { end: () => {} };

    const startTime = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.trackCustomMetric({
          name: 'filter_performance',
          value: duration,
          timestamp: Date.now(),
          metadata: {
            restaurantCount,
            filterType,
            durationMs: duration,
          }
        });

        // Warn if filtering is slow
        if (duration > 100) {
          console.warn(`Slow filtering detected: ${duration.toFixed(2)}ms for ${restaurantCount} restaurants (${filterType})`);
        }
      }
    };
  }

  /**
   * Track Google Maps rendering performance
   */
  trackMapPerformance(markerCount: number): { end: () => void } {
    if (!this.isEnabled) return { end: () => {} };

    const startTime = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.trackCustomMetric({
          name: 'map_render_performance',
          value: duration,
          timestamp: Date.now(),
          metadata: {
            markerCount,
            renderDurationMs: duration,
          }
        });

        // Warn if map rendering is slow
        if (duration > 500) {
          console.warn(`Slow map rendering: ${duration.toFixed(2)}ms for ${markerCount} markers`);
        }
      }
    };
  }

  /**
   * Get performance summary for debugging
   */
  getPerformanceSummary(): {
    filterMetrics: { avg: number; count: number; max: number };
    mapMetrics: { avg: number; count: number; max: number };
  } {
    const filterMetrics = this.metrics.filter(m => m.name === 'filter_performance');
    const mapMetrics = this.metrics.filter(m => m.name === 'map_render_performance');

    return {
      filterMetrics: {
        avg: filterMetrics.length > 0 ? 
             filterMetrics.reduce((sum, m) => sum + m.value, 0) / filterMetrics.length : 0,
        count: filterMetrics.length,
        max: filterMetrics.length > 0 ? Math.max(...filterMetrics.map(m => m.value)) : 0,
      },
      mapMetrics: {
        avg: mapMetrics.length > 0 ? 
             mapMetrics.reduce((sum, m) => sum + m.value, 0) / mapMetrics.length : 0,
        count: mapMetrics.length,
        max: mapMetrics.length > 0 ? Math.max(...mapMetrics.map(m => m.value)) : 0,
      }
    };
  }

  /**
   * Track Web Vitals if supported
   */
  trackWebVitals(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Track Core Web Vitals if supported
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          
          this.trackCustomMetric({
            name: 'web_vital_lcp',
            value: lastEntry.startTime,
            timestamp: Date.now(),
            metadata: { type: 'LCP' }
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          
          if (clsValue > 0) {
            this.trackCustomMetric({
              name: 'web_vital_cls',
              value: clsValue,
              timestamp: Date.now(),
              metadata: { type: 'CLS' }
            });
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize Web Vitals tracking
if (typeof window !== 'undefined') {
  performanceMonitor.trackWebVitals();
}