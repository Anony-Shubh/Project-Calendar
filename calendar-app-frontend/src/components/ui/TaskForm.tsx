import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Define a schema for validation using zod
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  time: z
    .string()
    .refine(
      (timeString) => {
        // Parse the ISO string and extract the time part
        const time = new Date(timeString);
        const hours = time.getHours();
        const minutes = time.getMinutes();

        // Check if the time part is in HH:mm format
        return timeRegex.test(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`
        );
      },
      {
        message: "Time must be in HH:mm format",
      }
    )
    .refine(
      (timeString) => {
        // Parse the ISO string
        const time = new Date(timeString);

        // Get the current time
        const now = new Date();

        // Check if the time is in the future compared to the current time
        return time.getTime() > now.getTime();
      },
      {
        message: "Time must be in the future",
      }
    ),
});

type TaskFormProps = {
  onSubmit: (data: z.infer<typeof taskFormSchema>) => void;
  initialData?: Partial<z.infer<typeof taskFormSchema>>;
};

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      time: new Date().toISOString().slice(11, 16), // Default to current time in 'HH:mm' format
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default TaskForm;
