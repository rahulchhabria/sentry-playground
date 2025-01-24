"use client";

import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import { Hourglass, Loader2 } from "lucide-react";
import { useState } from "react";

const spanTypes = [
  {
    name: "Database Query",
    op: "db.query",
    description: "SELECT * FROM large_table",
    minDuration: 500,
    maxDuration: 2000,
  },
  {
    name: "API Call",
    op: "http.client",
    description: "GET /api/data",
    minDuration: 1000,
    maxDuration: 3000,
  },
  {
    name: "File Processing",
    op: "file.process",
    description: "Process large file",
    minDuration: 800,
    maxDuration: 2500,
  },
  {
    name: "Cache Operation",
    op: "cache.set",
    description: "Update cache data",
    minDuration: 200,
    maxDuration: 1000,
  },
  {
    name: "Authentication",
    op: "auth.verify",
    description: "Verify user token",
    minDuration: 300,
    maxDuration: 1500,
  },
  {
    name: "Image Processing",
    op: "image.process",
    description: "Resize image",
    minDuration: 1500,
    maxDuration: 4000,
  },
  {
    name: "Search Operation",
    op: "search.query",
    description: "Full-text search",
    minDuration: 700,
    maxDuration: 2500,
  },
  {
    name: "Background Task",
    op: "task.background",
    description: "Process queue",
    minDuration: 1000,
    maxDuration: 3500,
  },
  {
    name: "Data Export",
    op: "export.generate",
    description: "Generate CSV export",
    minDuration: 2000,
    maxDuration: 5000,
  },
  {
    name: "Synchronization",
    op: "sync.execute",
    description: "Sync external service",
    minDuration: 1500,
    maxDuration: 4000,
  }
];

const generateRandomDuration = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateRandomSpan = async () => {
  const randomIndex = Math.floor(Math.random() * spanTypes.length);
  const spanType = spanTypes[randomIndex];
  
  const transaction = Sentry.startTransaction({
    name: `Random ${spanType.name}`,
  });

  Sentry.configureScope(scope => {
    scope.setSpan(transaction);
  });

  // Create a child span for the slow operation
  const span = transaction.startChild({
    op: spanType.op,
    description: spanType.description,
  });

  // Generate a random duration within the defined range
  const duration = generateRandomDuration(spanType.minDuration, spanType.maxDuration);
  
  // Simulate the slow operation
  await new Promise(resolve => setTimeout(resolve, duration));

  // Add some context to the span
  span.setTag("duration_ms", duration);
  span.setTag("operation_type", spanType.name);
  span.setData("performance_impact", duration > (spanType.maxDuration + spanType.minDuration) / 2 ? "high" : "low");

  span.finish();
  transaction.finish();
};

export function RandomSpans() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sendRandomSpans = async () => {
    setLoading(true);
    setProgress(0);

    for (let i = 0; i < 20; i++) {
      await generateRandomSpan();
      setProgress(i + 1);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="secondary"
        size="lg"
        className="flex items-center gap-2"
        onClick={sendRandomSpans}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Hourglass className="h-4 w-4" />
        )}
        Send 20 Random Slow Spans
      </Button>
      
      {loading && (
        <div className="text-sm text-gray-400">
          Generating spans: {progress}/20
        </div>
      )}
    </div>
  );
}