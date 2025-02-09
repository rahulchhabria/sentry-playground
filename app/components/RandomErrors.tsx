"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

const errorTypes = [
  {
    name: "TypeError",
    generate: () => {
      Sentry.captureMessage("TypeError triggered", "error");
      const obj = null;
      obj.someMethod();
    }
  },
  {
    name: "ReferenceError",
    generate: () => {
      Sentry.captureMessage("ReferenceError triggered", "error");
      nonExistentFunction();
    }
  },
  {
    name: "SyntaxError",
    generate: () => {
      throw new SyntaxError("Invalid syntax in dynamic code");
    }
  },
  {
    name: "RangeError",
    generate: () => {
      const arr = new Array(-1);
    }
  },
  {
    name: "URIError",
    generate: () => {
      decodeURIComponent("%");
    }
  },
  {
    name: "NetworkError",
    generate: async () => {
      await fetch("https://non-existent-domain-12345.com");
    }
  },
  {
    name: "CustomError",
    generate: () => {
      throw new Error("Custom application error");
    }
  },
  {
    name: "AsyncError",
    generate: async () => {
      await Promise.reject(new Error("Async operation failed"));
    }
  },
  {
    name: "ValidationError",
    generate: () => {
      throw new Error("Invalid user input");
    }
  },
  {
    name: "StateError",
    generate: () => {
      throw new Error("Invalid state transition");
    }
  }
];

export function RandomErrors() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sendRandomErrors = async () => {
    setLoading(true);
    setProgress(0);

    const transaction = Sentry.startTransaction({
      name: "random-errors",
      op: "test",
    });

    Sentry.configureScope(scope => {
      scope.setTag("test_type", "random_errors");
      scope.setContext("test_info", {
        total_errors: 20,
        test_run_id: Date.now(),
      });
    });

    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      try {
        const randomIndex = Math.floor(Math.random() * errorTypes.length);
        errorTypes[randomIndex].generate();
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            error_index: i,
            error_type: errorTypes[randomIndex].name,
          },
        });
        toast.error(`Error ${i + 1}/20: ${error.message}`);
      }
      setProgress(i + 1);
    }

    transaction.finish();
    setLoading(false);
    toast.success("Completed sending random errors");
  };

  const throwFrontendError = () => {
    try {
      throw new Error("Manual frontend error");
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          error_type: "frontend",
          test_type: "manual",
        },
      });
      toast.error("Frontend error triggered");
    }
  };

  const throwPromiseError = async () => {
    try {
      await new Promise((_, reject) => {
        reject(new Error("Async operation failed"));
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          error_type: "promise",
          test_type: "manual",
        },
      });
      toast.error("Promise error triggered");
    }
  };

  const throwNetworkError = async () => {
    try {
      await fetch('/api/non-existent-endpoint');
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          error_type: "network",
          test_type: "manual",
        },
      });
      toast.error("Network error triggered");
    }
  };

  const throwMemoryError = () => {
    try {
      const arr = [];
      while (true) {
        arr.push(new Array(10000000));
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          error_type: "memory",
          test_type: "manual",
        },
      });
      toast.error("Memory error triggered");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="destructive"
        size="lg"
        className="flex items-center gap-2"
        onClick={sendRandomErrors}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        Send 20 Random Errors
      </Button>
      
      {loading && (
        <div className="text-sm text-gray-400">
          Sending errors: {progress}/20
        </div>
      )}

      <div className="error-buttons-container">
        <h3>Test Error Tracking</h3>
        <div className="error-buttons">
          <Button 
            variant="destructive"
            onClick={throwFrontendError}
          >
            Frontend Error
          </Button>
          <Button 
            variant="destructive"
            onClick={throwPromiseError}
          >
            Promise Error
          </Button>
          <Button 
            variant="destructive"
            onClick={throwNetworkError}
          >
            Network Error
          </Button>
          <Button 
            variant="destructive"
            onClick={throwMemoryError}
          >
            Memory Error
          </Button>
        </div>
      </div>
    </div>
  );
}