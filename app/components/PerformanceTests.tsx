"use client";

import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import { Clock, Database, Loader2, Server } from "lucide-react";
import { useState } from "react";

export function PerformanceTests() {
  const [loading, setLoading] = useState(false);

  const simulateSlowOperation = async () => {
    const transaction = Sentry.startTransaction({
      name: "slow-operation",
      op: "test.performance",
    });

    try {
      // Simulate a slow operation
      await new Promise(resolve => setTimeout(resolve, 3000));
      transaction.setStatus("ok");
    } catch (error) {
      transaction.setStatus("error");
      Sentry.captureException(error);
    } finally {
      transaction.finish();
    }
  };

  const simulateMemoryLeak = () => {
    const transaction = Sentry.startTransaction({
      name: "memory-leak",
      op: "test.memory",
    });

    try {
      const arr = [];
      for (let i = 0; i < 1000000; i++) {
        arr.push(new Array(1000));
      }
      transaction.setStatus("ok");
    } catch (error) {
      transaction.setStatus("error");
      Sentry.captureException(error);
    } finally {
      transaction.finish();
    }
  };

  const simulateHighCPU = () => {
    const transaction = Sentry.startTransaction({
      name: "high-cpu",
      op: "test.cpu",
    });

    try {
      let result = 0;
      for (let i = 0; i < 10000000; i++) {
        result += Math.sqrt(i);
      }
      transaction.setStatus("ok");
    } catch (error) {
      transaction.setStatus("error");
      Sentry.captureException(error);
    } finally {
      transaction.finish();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="secondary"
        onClick={simulateSlowOperation}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        Simulate Slow Operation
      </Button>

      <Button
        variant="secondary"
        onClick={simulateMemoryLeak}
      >
        Simulate Memory Leak
      </Button>

      <Button
        variant="secondary"
        onClick={simulateHighCPU}
      >
        Simulate High CPU Usage
      </Button>
    </div>
  );
}
