"use client";

import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import { Clock, Database, Loader2, Server } from "lucide-react";
import { useState } from "react";

export function PerformanceTests() {
  const [loading, setLoading] = useState<string | null>(null);

  const simulateSlowOperation = async () => {
    setLoading("slow-op");
    const transaction = Sentry.startTransaction({
      name: "Slow Operation",
      op: "slow-operation"
    });

    Sentry.getCurrentHub().configureScope(scope => {
      scope.setSpan(transaction);
    });

    // Parent span for the entire operation
    const span = transaction.startChild({
      op: "task",
      description: "Expensive calculation",
    });

    // Simulate heavy computation
    const startTime = Date.now();
    while (Date.now() - startTime < 2000) {
      // Busy wait to simulate CPU-intensive task
    }

    span.finish();
    transaction.finish();
    setLoading(null);
  };

  const simulateSlowAPI = async () => {
    setLoading("slow-api");
    const transaction = Sentry.startTransaction({
      name: "Slow API Call",
      op: "http"
    });

    try {
      const span = transaction.startChild({
        op: "http.client",
        description: "GET /api/slow",
      });

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      span.setStatus("ok");
      span.finish();
    } catch (error) {
      transaction.setStatus("internal_error");
      throw error;
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  const simulateNestedOperations = async () => {
    setLoading("nested");
    const transaction = Sentry.startTransaction({
      name: "Nested Operations",
      op: "nested"
    });

    // Database query simulation
    const dbSpan = transaction.startChild({
      op: "db.query",
      description: "SELECT * FROM large_table",
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    dbSpan.finish();

    // Processing simulation
    const processSpan = transaction.startChild({
      op: "task.process",
      description: "Process data",
    });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    processSpan.finish();

    // Cache operation simulation
    const cacheSpan = transaction.startChild({
      op: "cache.set",
      description: "Update cache",
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    cacheSpan.finish();

    transaction.finish();
    setLoading(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={simulateSlowOperation}
        disabled={!!loading}
      >
        {loading === "slow-op" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
        Trigger Slow Operation
      </Button>

      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={simulateSlowAPI}
        disabled={!!loading}
      >
        {loading === "slow-api" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Server className="h-4 w-4" />
        )}
        Trigger Slow API Call
      </Button>

      <Button
        variant="secondary"
        className="flex items-center gap-2 col-span-full"
        onClick={simulateNestedOperations}
        disabled={!!loading}
      >
        {loading === "nested" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        Trigger Nested Operations
      </Button>
    </div>
  );
}
