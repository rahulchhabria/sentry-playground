"use client";

import { Button } from "@/components/ui/button";
import { Clock, Database, Loader2, Server } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PerformanceTests() {
  const [loading, setLoading] = useState<string | null>(null);

  const simulateSlowOperation = async () => {
    setLoading('slow');
    toast.info("Starting slow operation...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success("Slow operation completed");
    } catch (error) {
      toast.error("Slow operation failed");
    } finally {
      setLoading(null);
    }
  };

  const simulateMemoryLeak = () => {
    setLoading('memory');
    toast.info("Simulating memory leak...");
    
    try {
      const arr = [];
      for (let i = 0; i < 1000000; i++) {
        arr.push(new Array(1000));
      }
      toast.success("Memory leak simulation completed");
    } catch (error) {
      toast.error("Memory operation failed");
    } finally {
      setLoading(null);
    }
  };

  const simulateHighCPU = () => {
    setLoading('cpu');
    toast.info("Starting CPU intensive operation...");
    
    try {
      let result = 0;
      for (let i = 0; i < 10000000; i++) {
        result += Math.sqrt(i);
      }
      toast.success("CPU intensive operation completed");
    } catch (error) {
      toast.error("CPU operation failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={simulateSlowOperation}
        disabled={loading === 'slow'}
      >
        {loading === 'slow' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
        Simulate Slow Operation
      </Button>

      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={simulateMemoryLeak}
        disabled={loading === 'memory'}
      >
        {loading === 'memory' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        Simulate Memory Leak
      </Button>

      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={simulateHighCPU}
        disabled={loading === 'cpu'}
      >
        {loading === 'cpu' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Server className="h-4 w-4" />
        )}
        Simulate High CPU Usage
      </Button>
    </div>
  );
}
