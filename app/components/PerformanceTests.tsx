"use client";

import { Button } from "@/components/ui/button";
import { Clock, Database, Loader2, Server } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

export function PerformanceTests() {
  const [loading, setLoading] = useState<string | null>(null);

  const simulateSlowOperation = async () => {
    setLoading('slow');
    const transaction = Sentry.startTransaction({ name: "slow-operation" });
    
    try {
      toast.info("Starting slow operation...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success("Slow operation completed");
      transaction.setStatus("ok");
    } catch (error) {
      toast.error("Slow operation failed");
      transaction.setStatus("error");
      Sentry.captureException(error);
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  const simulateMemoryLeak = async () => {
    setLoading('memory');
    const transaction = Sentry.startTransaction({ name: "memory-leak" });
    
    try {
      toast.info("Simulating memory leak...");
      const arr = [];
      for (let i = 0; i < 1000000; i++) {
        arr.push(new Array(1000));
      }
      toast.success("Memory leak simulation completed");
      transaction.setStatus("ok");
    } catch (error) {
      toast.error("Memory operation failed");
      transaction.setStatus("error");
      Sentry.captureException(error);
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  const simulateHighCPU = async () => {
    setLoading('cpu');
    const transaction = Sentry.startTransaction({ name: "high-cpu" });
    
    try {
      toast.info("Starting CPU intensive operation...");
      let result = 0;
      for (let i = 0; i < 10000000; i++) {
        result += Math.sqrt(i);
      }
      toast.success("CPU intensive operation completed");
      transaction.setStatus("ok");
    } catch (error) {
      toast.error("CPU operation failed");
      transaction.setStatus("error");
      Sentry.captureException(error);
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        className="flex items-center gap-2 min-w-[200px] justify-center"
        onClick={simulateSlowOperation}
        disabled={!!loading}
      >
        {loading === 'slow' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
        {loading === 'slow' ? 'Processing...' : 'Slow Operation'}
      </Button>

      <Button
        variant="destructive"
        className="flex items-center gap-2 min-w-[200px] justify-center"
        onClick={simulateMemoryLeak}
        disabled={!!loading}
      >
        {loading === 'memory' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        {loading === 'memory' ? 'Processing...' : 'Memory Leak'}
      </Button>

      <Button
        variant="destructive"
        className="flex items-center gap-2 min-w-[200px] justify-center"
        onClick={simulateHighCPU}
        disabled={!!loading}
      >
        {loading === 'cpu' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Server className="h-4 w-4" />
        )}
        {loading === 'cpu' ? 'Processing...' : 'High CPU Usage'}
      </Button>
    </div>
  );
}
