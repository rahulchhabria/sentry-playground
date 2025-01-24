"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Bug, Code2, MessageSquare, Network } from "lucide-react";
import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { FeedbackDialog } from "./FeedbackDialog";

export function ErrorButtons() {
  const [lastError, setLastError] = useState<Error | null>(null);
  const [lastEventId, setLastEventId] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleError = (error: Error) => {
    // Capture the error and ensure we get back an event ID
    const eventId = Sentry.captureException(error);
    
    // Set both the error and event ID
    setLastError(error);
    setLastEventId(eventId);

    // Log for debugging
    console.log('Error captured:', { error, eventId });
  };

  const triggerRuntimeError = () => {
    try {
      throw new Error("This is a runtime error!");
    } catch (error) {
      handleError(error as Error);
    }
  };

  const triggerPromiseRejection = async () => {
    try {
      await new Promise((_, reject) => {
        reject(new Error("This promise was rejected!"));
      });
    } catch (error) {
      handleError(error as Error);
    }
  };

  const triggerNetworkError = async () => {
    try {
      await fetch("https://non-existent-domain-12345.com");
    } catch (error) {
      handleError(error as Error);
    }
  };

  const triggerTypeError = () => {
    try {
      // @ts-ignore
      const obj = null;
      obj.someMethod();
    } catch (error) {
      handleError(error as Error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={triggerRuntimeError}
        >
          <Bug className="h-4 w-4" />
          Trigger Runtime Error
        </Button>

        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={() => triggerPromiseRejection()}
        >
          <Code2 className="h-4 w-4" />
          Trigger Promise Rejection
        </Button>

        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={() => triggerNetworkError()}
        >
          <Network className="h-4 w-4" />
          Trigger Network Error
        </Button>

        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={triggerTypeError}
        >
          <AlertCircle className="h-4 w-4" />
          Trigger Type Error
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2 col-span-full"
          onClick={() => setShowFeedback(true)}
          disabled={!lastError}
        >
          <MessageSquare className="h-4 w-4" />
          Provide Error Feedback
        </Button>
      </div>

      {lastError && lastEventId && (
        <FeedbackDialog
          error={lastError}
          eventId={lastEventId}
          open={showFeedback}
          onOpenChange={setShowFeedback}
        />
      )}
    </>
  );
}