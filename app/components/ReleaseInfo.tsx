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
    toast.error("Release error triggered");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(null);
  };

  const simulateReleaseRegression = async () => {
    setLoading('regression');
    toast.error("Release regression detected");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(null);
  };

  const simulateFeatureError = async () => {
    setLoading('feature');
    toast.error("Feature error triggered");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(null);
  };

  const simulateHealthySession = async () => {
    setLoading('session');
    toast.info("Starting healthy session...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Healthy session completed");
    setLoading(null);
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
          className="flex items-center gap-2"
          onClick={simulateFeatureError}
          disabled={!!loading}
        >
          {loading === "feature" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitCommit className="h-4 w-4" />
          )}
          Simulate Feature Error
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