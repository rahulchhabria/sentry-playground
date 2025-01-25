import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";
import { CronJobManager } from './CronJobManager';
import './CronJobManager.css';

interface MetricsState {
  errorCount: number;
  lastError: {
    message: string;
    timestamp: number;
  } | null;
  performance: {
    pageLoadTime: number;
  };
}

export function SentryDevTools() {
  const [metrics, setMetrics] = useState<MetricsState>({
    errorCount: 0,
    lastError: null,
    performance: {
      pageLoadTime: 0,
    },
  });

  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV !== 'production');

  useEffect(() => {
    // Track page load performance
    const pageLoadTime = performance.now();
    setMetrics(prev => ({
      ...prev,
      performance: {
        pageLoadTime,
      },
    }));

    // Listen for errors
    Sentry.addGlobalEventProcessor((event) => {
      setMetrics(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
        lastError: {
          message: event.message || 'Unknown error',
          timestamp: Date.now(),
        },
      }));
      return event;
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="sentry-dev-tools">
      <div className="sentry-dev-tools-header">
        <h3>Sentry Dev Tools</h3>
        <button onClick={() => setIsVisible(false)}>Close</button>
      </div>
      
      <div className="sentry-dev-tools-content">
        <div className="metrics-section">
          <h4>Error Tracking</h4>
          <div>Total Errors: {metrics.errorCount}</div>
          {metrics.lastError && (
            <div className="last-error">
              <div>Last Error: {metrics.lastError.message}</div>
              <small>
                {new Date(metrics.lastError.timestamp).toLocaleString()}
              </small>
            </div>
          )}
        </div>

        <div className="metrics-section">
          <h4>Performance</h4>
          <div>Page Load Time: {Math.round(metrics.performance.pageLoadTime)}ms</div>
        </div>

        <div className="test-buttons">
          <button
            onClick={() => {
              throw new Error("Test Frontend Error");
            }}
          >
            Trigger Test Error
          </button>
        </div>

        <div className="dev-tools-section">
          <CronJobManager />
        </div>
      </div>
    </div>
  );
} 