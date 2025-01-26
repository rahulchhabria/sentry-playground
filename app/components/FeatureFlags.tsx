"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import * as Sentry from "@sentry/nextjs";
import { Flag, Loader2, Settings } from "lucide-react";
import { useState } from "react";

export function FeatureFlags() {
  const { newFeature, betaFeature } = useFlags();
  const [loading, setLoading] = useState<string | null>(null);
  const ldClient = useLDClient();

  const simulateFeatureError = async () => {
    setLoading("error");
    try {
      if (newFeature) {
        throw new Error("Error in new feature");
      } else {
        throw new Error("Error in old feature");
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          newFeature: String(newFeature),
          betaFeature: String(betaFeature),
        },
      });
    } finally {
      setLoading(null);
    }
  };

  const simulateFeaturePerformance = async () => {
    setLoading("performance");
    
    const transaction = Sentry.startTransaction({
      name: "Feature Performance Test",
    });

    try {
      const span = transaction.startChild({
        op: "feature.test",
        description: `Testing ${newFeature ? "new" : "old"} feature performance`,
      });

      // Simulate different performance characteristics based on feature flag
      await new Promise(resolve => 
        setTimeout(resolve, newFeature ? 1000 : 3000)
      );

      span.setTag("newFeature", String(newFeature));
      span.setTag("betaFeature", String(betaFeature));
      span.finish();
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  const updateUserContext = async () => {
    setLoading("context");
    try {
      await ldClient?.identify({
        kind: "user",
        key: "test-user",
        name: "Test User",
        email: "test@example.com",
        custom: {
          group: "beta-testers",
        },
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-blue-400" />
              <span>New Feature</span>
            </div>
            <span className={newFeature ? "text-green-400" : "text-red-400"}>
              {newFeature ? "Enabled" : "Disabled"}
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-400" />
              <span>Beta Feature</span>
            </div>
            <span className={betaFeature ? "text-green-400" : "text-red-400"}>
              {betaFeature ? "Enabled" : "Disabled"}
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={simulateFeatureError}
          disabled={!!loading}
        >
          {loading === "error" ? (
            <Loader2 className="h-4 w-4 animate-spin" data-testid="loading-spinner" />
          ) : (
            <Flag className="h-4 w-4" />
          )}
          Simulate Feature Error
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={simulateFeaturePerformance}
          disabled={!!loading}
        >
          {loading === "performance" ? (
            <Loader2 className="h-4 w-4 animate-spin" data-testid="loading-spinner" />
          ) : (
            <Settings className="h-4 w-4" />
          )}
          Test Feature Performance
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2 col-span-full"
          onClick={updateUserContext}
          disabled={!!loading}
        >
          {loading === "context" ? (
            <Loader2 className="h-4 w-4 animate-spin" data-testid="loading-spinner" />
          ) : (
            <Settings className="h-4 w-4" />
          )}
          Update User Context
        </Button>
      </div>
    </div>
  );
}
