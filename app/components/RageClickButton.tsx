"use client";

import { Button } from "@/components/ui/button";
import { MousePointer2 } from "lucide-react";

export function RageClickButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="outline"
        size="lg"
        className="relative overflow-hidden bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-colors group"
        aria-label="Click me repeatedly"
      >
        <div className="flex items-center gap-2">
          <MousePointer2 className="h-4 w-4 group-hover:animate-bounce" />
          <span>This Button Does Nothing</span>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse" />
        </div>
      </Button>
      <p className="text-sm text-gray-400">
        Try clicking this button repeatedly to test rage clicks!
      </p>
    </div>
  );
}