"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";

interface FeedbackDialogProps {
  error: Error;
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ error, eventId, open, onOpenChange }: FeedbackDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the feedback submission for debugging
    console.log('Submitting feedback:', { eventId, name, email, comments });
    
    // Submit the user feedback to Sentry
    Sentry.captureEvent({
      type: 'feedback',
      event_id: eventId,
      level: 'info',
      user: {
        name: name,
        email: email
      },
      extra: {
        comments: comments
      }
    });

    // Mark as submitted and close the dialog
    setSubmitted(true);
    setTimeout(() => {
      onOpenChange(false);
      // Reset form after dialog closes
      setName("");
      setEmail("");
      setComments("");
      setSubmitted(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border border-gray-800 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <DialogTitle className="text-xl font-semibold text-white">
              {submitted ? "Feedback Submitted!" : "Error Feedback"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            {submitted 
              ? "Thank you for your feedback. This helps us improve our application."
              : "Help us improve by sharing what went wrong. Your feedback is valuable to us."}
          </DialogDescription>
        </DialogHeader>
        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  What happened?
                </Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Please describe what you were doing when the error occurred..."
                  required
                />
              </div>
              <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-sm space-y-1">
                <p className="text-gray-400 flex items-center gap-2">
                  <span className="font-medium text-gray-300">Error:</span>
                  {error.message}
                </p>
                <p className="text-gray-400 flex items-center gap-2">
                  <span className="font-medium text-gray-300">Event ID:</span>
                  <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">{eventId}</code>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Submit Feedback
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
