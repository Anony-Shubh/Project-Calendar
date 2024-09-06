"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { api, Event, Task } from "@/services/api";
import { Edit, Trash } from "lucide-react";
import EventForm from "@/components/ui/EventForm"; // Import your form component
import TaskForm from "@/components/ui/TaskForm"; // Import your form component

interface DateDialogProps {
  date: string;
  buttonText: string;
  initialEventData?: Event; // For event editing
  initialTaskData?: Task; // For task editing
  onClose?: () => void;
}

const DateDialog: React.FC<DateDialogProps> = ({
  date,
  buttonText,
  initialEventData,
  initialTaskData,
  onClose,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editEventData, setEditEventData] = useState<Event | null>(null);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);

  const fetchEventAndTaskData = useCallback(async () => {
    setLoading(true);
    try {
      const eventsData = await api.getAllEventForDate(date);
      const tasksData = await api.getAllTaskForDate(date);

      setEvents(eventsData);
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    if (dialogOpen) {
      fetchEventAndTaskData();
    }
  }, [dialogOpen, date, fetchEventAndTaskData]);

  useEffect(() => {
    if (initialEventData) {
      setEditEventData(initialEventData);
    }
    if (initialTaskData) {
      setEditTaskData(initialTaskData);
    }
  }, [initialEventData, initialTaskData]);

  const handleDeleteTask = async (id: string) => {
    await api.deleteTask(id);
    fetchEventAndTaskData();
  };

  const handleDeleteEvent = async (id: string) => {
    await api.deleteEvent(id);
    fetchEventAndTaskData();
  };

  const handleEditTask = async (id: string, taskData: Omit<Task, "id">) => {
    await api.updateTask(id, taskData);
    fetchEventAndTaskData();
  };

  const handleEditEvent = async (id: string, eventData: Omit<Event, "id">) => {
    await api.updateEvent(id, eventData);
    fetchEventAndTaskData();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-4">
            Events and Tasks for {format(new Date(date), "dd-MM-yyyy")}
          </DialogTitle>
        </DialogHeader>
        <DialogClose
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={handleClose}
        >
          <span className="sr-only">Close</span>
        </DialogClose>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Events:</h3>
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-100 p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-gray-700">{event.description}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                        <p>
                          <strong>Start Time:</strong> {event.startTime}
                        </p>
                        <p>
                          <strong>End Time:</strong> {event.endTime}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex space-x-2 items-center">
                        {/* Edit and Delete Icons */}
                        <button
                          onClick={() => setEditEventData(event)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          aria-label="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Delete Event"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No events found.</p>
              )}
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Tasks:</h3>
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-100 p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <p className="text-gray-700">{task.description}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center">
                        <p className="mr-4">
                          <strong>Due Time:</strong>{" "}
                          {format(parseISO(task.time), "HH:mm")}
                        </p>
                        <div className="flex space-x-2">
                          {/* Edit and Delete Icons */}
                          <button
                            onClick={() => setEditTaskData(task)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            aria-label="Edit Task"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={async () =>
                              await handleDeleteTask(task.id)
                            }
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Delete Task"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tasks found.</p>
              )}
            </div>
          </>
        )}
        {/* Conditional Rendering of Forms for Editing */}
        {editEventData && (
          <EventForm
            initialData={editEventData}
            onSubmit={async (data) => {
              await handleEditEvent(editEventData.id, data);
              setEditEventData(null);
              fetchEventAndTaskData();
            }}
          />
        )}
        {editTaskData && (
          <TaskForm
            initialData={editTaskData}
            onSubmit={async (data) => {
              await handleEditTask(editTaskData.id, data);
              setEditTaskData(null);
              fetchEventAndTaskData();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DateDialog;
