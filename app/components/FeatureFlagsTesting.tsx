"use client";

import { Button } from "@/components/ui/button";
import { useFlags } from "launchdarkly-react-client-sdk";
import { Sparkles, Rocket, Zap, Star } from "lucide-react";

export function FeatureFlagsTesting() {
  const flags = useFlags();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      {flags.experimentalFeature && (
        <Button
          variant="secondary"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Sparkles className="h-4 w-4" />
          Experimental Feature
        </Button>
      )}

      {flags.betaFeature && (
        <Button
          variant="secondary"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          <Rocket className="h-4 w-4" />
          Beta Feature
        </Button>
      )}

      {flags.premiumFeature && (
        <Button
          variant="secondary"
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          <Star className="h-4 w-4" />
          Premium Feature
        </Button>
      )}

      {flags.powerUserFeature && (
        <Button
          variant="secondary"
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          <Zap className="h-4 w-4" />
          Power User Feature
        </Button>
      )}

      {!Object.values(flags).some(Boolean) && (
        <p className="col-span-full text-center text-gray-400">
          No feature flags are currently enabled. Configure them in your LaunchDarkly dashboard.
        </p>
      )}
    </div>
  );
}