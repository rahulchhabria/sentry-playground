"use client";

import { Card } from "@/components/ui/card";
import { ErrorButtons } from "./components/ErrorButtons";
import { PerformanceTests } from "./components/PerformanceTests";
import { ReleaseInfo } from "./components/ReleaseInfo";
import { RandomErrors } from "./components/RandomErrors";
import { RageClickButton } from "./components/RageClickButton";
import { AlertTriangle, Bug, Gauge, GitBranch, MousePointer2 } from "lucide-react";
import './components/RandomErrors.css';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#11121D]">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Bug className="h-14 w-14 text-purple-500" />
            <AlertTriangle className="h-14 w-14 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6 pb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Sentry Testing Playground
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Test error monitoring, performance tracking, and release management features below.
          </p>
        </div>

        <div className="grid gap-6 max-w-[1200px] mx-auto">
          {/* Error Testing Section */}
          <Card className="bg-[#1B1C2B] border-[#2B2C3B] shadow-lg hover:border-purple-500/20 transition-colors">
            <div className="p-8">
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <AlertTriangle className="h-7 w-7 text-yellow-400" />
                  Error Testing
                </h2>
                <ErrorButtons />
                <RandomErrors />
                <p className="text-sm text-gray-400">
                  Test different types of errors and error handling patterns.
                </p>
              </div>
            </div>
          </Card>

          {/* Performance Testing Section */}
          <Card className="bg-[#1B1C2B] border-[#2B2C3B] shadow-lg hover:border-purple-500/20 transition-colors">
            <div className="p-8">
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <Gauge className="h-7 w-7 text-blue-400" />
                  Performance Testing
                </h2>
                <PerformanceTests />
                <p className="text-sm text-gray-400">
                  Test performance monitoring with CPU, memory, and slow operations.
                </p>
              </div>
            </div>
          </Card>

          {/* Release Testing Section */}
          <Card className="bg-[#1B1C2B] border-[#2B2C3B] shadow-lg hover:border-purple-500/20 transition-colors">
            <div className="p-8">
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <GitBranch className="h-7 w-7 text-green-400" />
                  Release Testing
                </h2>
                <ReleaseInfo />
                <p className="text-sm text-gray-400">
                  Test release tracking and session monitoring features.
                </p>
              </div>
            </div>
          </Card>

          {/* User Interaction Testing */}
          <Card className="bg-[#1B1C2B] border-[#2B2C3B] shadow-lg hover:border-purple-500/20 transition-colors">
            <div className="p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                  <MousePointer2 className="h-7 w-7 text-purple-400" />
                  <h2 className="text-2xl font-semibold text-white">User Interaction Testing</h2>
                </div>
                <RageClickButton />
                <p className="text-sm text-gray-400">
                  Test user interaction monitoring features like rage clicks and dead clicks.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}