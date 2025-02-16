"use client";

import { Button } from "@/components/ui/button";
import { Loader2, MousePointer2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

export function RageClickButton() {
  const [loading, setLoading] = useState(false);
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setLoading(true);
    setClicks(prev => prev + 1);

    const transaction = Sentry.startTransaction({
      name: "rage-click-test",
      op: "user-interaction",
    });

    try {
      if (clicks > 4) {
        toast.error("Rage click detected!");
        Sentry.captureMessage("Rage click detected", "warning");
      }
    } finally {
      transaction.finish();
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      className="flex items-center gap-2 min-w-[200px] justify-center"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MousePointer2 className="h-4 w-4" />
      )}
      {loading ? "Processing..." : "Click Me Repeatedly"}
    </Button>
  );
}