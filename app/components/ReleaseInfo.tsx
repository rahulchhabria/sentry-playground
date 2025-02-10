"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as Sentry from "@sentry/nextjs";
import { GitBranch, GitCommit, GitPullRequest, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ReleaseInfo() {
  const [loading, setLoading] = useState<string | null>(null);
  const currentRelease = process.env.NEXT_PUBLIC_SENTRY_RELEASE || "development";

  const simulateReleaseError = async () => {
    setLoading('error');
    const transaction = Sentry.startTransaction({ name: "release-error" });
    
    try {
      toast.info("Simulating release error...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error("Release deployment error");
    } catch (error) {
      toast.error("Release error triggered");
      Sentry.captureException(error, {
        tags: { error_type: "release", test_type: "manual" },
      });
      transaction.setStatus("error");
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  const simulateReleaseRegression = async () => {
    setLoading('regression');
    const transaction = Sentry.startTransaction({ name: "release-regression" });
    
    try {
      toast.info("Simulating performance regression...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error("Performance regression detected");
    } catch (error) {
      toast.error("Release regression detected");
      Sentry.captureException(error, {
        tags: { error_type: "regression", test_type: "manual" },
      });
      transaction.setStatus("error");
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  const simulateFeatureError = async () => {
    setLoading('feature');
    const transaction = Sentry.startTransaction({ name: "feature-error" });
    
    try {
      toast.info("Testing new feature...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error("New feature implementation error");
    } catch (error) {
      toast.error("Feature error triggered");
      Sentry.captureException(error, {
        tags: { error_type: "feature", test_type: "manual" },
      });
      transaction.setStatus("error");
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  const simulateHealthySession = async () => {
    setLoading('session');
    const transaction = Sentry.startTransaction({ name: "healthy-session" });
    
    try {
      toast.info("Starting healthy session...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Healthy session completed");
      transaction.setStatus("ok");
    } catch (error) {
      toast.error("Session simulation failed");
      Sentry.captureException(error);
      transaction.setStatus("error");
    } finally {
      transaction.finish();
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <GitBranch className="h-4 w-4" />
        <span>Current Release: {currentRelease}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
        <Button
          variant="secondary"
          className="flex items-center gap-2 min-w-[200px] justify-center"
          onClick={simulateReleaseError}
          disabled={!!loading}
        >
          {loading === "error" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitCommit className="h-4 w-4" />
          )}
          {loading === "error" ? "Processing..." : "Release Error"}
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2 min-w-[200px] justify-center"
          onClick={simulateReleaseRegression}
          disabled={!!loading}
        >
          {loading === "regression" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitPullRequest className="h-4 w-4" />
          )}
          {loading === "regression" ? "Processing..." : "Release Regression"}
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2 min-w-[200px] justify-center"
          onClick={simulateFeatureError}
          disabled={!!loading}
        >
          {loading === "feature" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitCommit className="h-4 w-4" />
          )}
          {loading === "feature" ? "Processing..." : "Feature Error"}
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2 min-w-[200px] justify-center"
          onClick={simulateHealthySession}
          disabled={!!loading}
        >
          {loading === "session" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitBranch className="h-4 w-4" />
          )}
          {loading === "session" ? "Processing..." : "Healthy Session"}
        </Button>
      </div>
    </div>
  );
}