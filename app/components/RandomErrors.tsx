"use client";

import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import { AlertOctagon, Loader2 } from "lucide-react";
import { useState } from "react";

const errorTypes = [
  {
    name: "TypeError",
    generate: () => {
      const obj = null;
      obj.someMethod();
    }
  },
  {
    name: "ReferenceError",
    generate: () => {
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

const generateRandomError = () => {
  const randomIndex = Math.floor(Math.random() * errorTypes.length);
  const errorType = errorTypes[randomIndex];
  
  try {
    errorType.generate();
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        errorType: errorType.name,
        source: "random-generator"
      },
      extra: {
        timestamp: new Date().toISOString(),
        randomSeed: Math.random()
      }
    });
  }
};

export function RandomErrors() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sendRandomErrors = async () => {
    setLoading(true);
    setProgress(0);

    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between errors
      generateRandomError();
      setProgress(i + 1);
    }

    setLoading(false);
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
          <AlertOctagon className="h-4 w-4" />
        )}
        Send 20 Random Errors
      </Button>
      
      {loading && (
        <div className="text-sm text-gray-400">
          Sending errors: {progress}/20
        </div>
      )}
    </div>
  );
}