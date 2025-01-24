"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as Sentry from "@sentry/nextjs";
import { GitBranch, GitCommit, GitPullRequest, Loader2 } from "lucide-react";
import { useState } from "react";

export function ReleaseInfo() {
  const [loading, setLoading] = useState<string | null>(null);
  const currentRelease = process.env.NEXT_PUBLIC_SENTRY_RELEASE || "development";

  const simulateReleaseError = async () => {
    setLoading("error");
    try {
      // Simulate an error with release context
      throw new Error("Error in current release");
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          release: currentRelease,
          feature: "critical-path",
        },
      });
    } finally {
      setLoading(null);
    }
  };

  const simulateReleaseRegression = async () => {
    setLoading("regression");
    try {
      // Simulate a regression across releases
      throw new Error("Regression detected in feature");
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          release: currentRelease,
          previousRelease: "v1.0.0",
          feature: "payment-processing",
        },
      });
    } finally {
      setLoading(null);
    }
  };

  const simulateHealthySession = () => {
    setLoading("session");
    // Start a new session
    Sentry.startSession();
    
    // Simulate some healthy user activity
    setTimeout(() => {
      // End the session normally
      Sentry.endSession();
      setLoading(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <GitBranch className="h-4 w-4" />
        <span>Current Release: {currentRelease}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={simulateReleaseError}
          disabled={!!loading}
        >
          {loading === "error" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitCommit className="h-4 w-4" />
          )}
          Simulate Release Error
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={simulateReleaseRegression}
          disabled={!!loading}
        >
          {loading === "regression" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitPullRequest className="h-4 w-4" />
          )}
          Simulate Release Regression
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2 col-span-full"
          onClick={simulateHealthySession}
          disabled={!!loading}
        >
          {loading === "session" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitBranch className="h-4 w-4" />
          )}
          Simulate Healthy Session
        </Button>
      </div>
    </div>
  );
}