"use client";

import React, { useState } from "react";
import Calendar from "@/components/ui/Calendar";
import EventForm, { formSchema } from "@/components/ui/EventForm";
import { api } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import TaskForm, { taskFormSchema } from "@/components/ui/TaskForm";

export default function Home() {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const handleCreateEvent = async (eventData: z.infer<typeof formSchema>) => {
    try {
      await api.createEvent(eventData);
      setIsEventDialogOpen(false); // Close the dialog on success
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleCreateTask = async (taskData: z.infer<typeof taskFormSchema>) => {
    try {
      await api.createTask(taskData);
      setIsTaskDialogOpen(false); // Close the dialog on success
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calendar App</h1>
      <div className="mb-4 flex justify-between items-center">
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEventDialogOpen(true)}>Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <EventForm onSubmit={handleCreateEvent} />
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsTaskDialogOpen(true)}>Create Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleCreateTask} />
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>
      <Calendar />
    </main>
  );
}
