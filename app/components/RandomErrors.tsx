"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const errorTypes = [
  {
    name: "TypeError",
    generate: () => {
      toast.error("TypeError triggered");
      const obj = null;
      obj.someMethod();
    }
  },
  {
    name: "ReferenceError",
    generate: () => {
      toast.error("ReferenceError triggered");
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

    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      try {
        const randomIndex = Math.floor(Math.random() * errorTypes.length);
        errorTypes[randomIndex].generate();
      } catch (error) {
        toast.error(`Error ${i + 1}/20: ${error.message}`);
      }
      setProgress(i + 1);
    }

    setLoading(false);
    toast.success("Completed sending random errors");
  };

  const throwFrontendError = () => {
    toast.error("Frontend error triggered");
    throw new Error("Manual frontend error");
  };

  const throwPromiseError = async () => {
    toast.error("Promise error triggered");
    await new Promise((_, reject) => {
      reject(new Error("Async operation failed"));
    });
  };

  const throwNetworkError = async () => {
    toast.error("Network error triggered");
    await fetch('/api/non-existent-endpoint');
  };

  const throwMemoryError = () => {
    toast.error("Memory error triggered");
    const arr = [];
    while (true) {
      arr.push(new Array(10000000));
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