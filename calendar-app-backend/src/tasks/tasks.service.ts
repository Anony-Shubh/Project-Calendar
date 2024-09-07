import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import * as webpush from 'web-push';

import { v4 as uuidv4 } from 'uuid';
import { Cron } from '@nestjs/schedule';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class TasksService {
  constructor() {
    // should be private
    webpush.setVapidDetails(
      'mailto: <shubhamupadhyay365@gmail.com>',
      'BNCbYfdvRJupQDNyvamHtgbdLcHSh6OQc9xNl1_1U8Yz33vzyk3DtKOLrivFBpOVypXLQiRB2AFmC1pxQZ72avs',
      'pMYiBuSGEf2BHtVAFpgWWsOa9gQBDtKZCVi7EoqcJAU',
    );
  }

  private tasks: Task[] = [];
  private subscription: webpush.PushSubscription[] = [];
  private subscriptionKey: Map<string, boolean> = new Map();

  @Cron('5 * * * *')
  async handleCron() {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
    // Find tasks that start in exactly 10 minutes
    const tasksStartingSoon = this.tasks.filter((task) => {
      const taskTime = new Date(task.time);
      return taskTime >= now && taskTime <= tenMinutesLater;
    });

    // If there are tasks starting soon, send notifications
    if (tasksStartingSoon.length > 0) {
      const message = JSON.stringify({
        title: 'Upcoming Task',
        body: `You have a task in ${differenceInMinutes(new Date(tasksStartingSoon[0].time), now)} : ${tasksStartingSoon[0].title}`,
      });

      for (const subscription of this.subscription) {
        try {
          if (!subscription) return;
          await webpush.sendNotification(subscription, message);
          console.log('push notification is successful');
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
    }
  }

  private checkTime(time: Date): boolean {
    const now = new Date();
    return time > now;
  }

  private convertToDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    return date;
  }

  createSubscription(subscription: webpush.PushSubscription) {
    if (this.subscriptionKey.has(subscription.keys.auth)) return;
    this.subscription.push(subscription);
    this.subscriptionKey.set(subscription.keys.auth, true);
    return;
  }

  create(createTaskDto: CreateTaskDto): string {
    const taskTime = this.convertToDate(createTaskDto.time);
    if (!this.checkTime(taskTime)) {
      throw new BadRequestException('Task time must be in the future');
    }
    const newTask: Task = {
      id: uuidv4(), // Assuming an ID based on the array length for simplicity
      title: createTaskDto.title,
      description: createTaskDto.description,
      time: taskTime, // Store as ISO string
    };
    this.tasks.push(newTask);
    return 'New task added successfully';
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  findAllForDate(date: string): Task[] {
    const parsedDate = new Date(date);

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      return []; // Return an empty array for invalid date
    }

    const targetDate = parsedDate.toISOString().split('T')[0];

    return this.tasks.filter((task) => {
      const taskDate = new Date(task.time).toISOString().split('T')[0];
      return taskDate === targetDate;
    });
  }

  update(id: string, updateTaskDto: UpdateTaskDto): string {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (updateTaskDto.time) {
      const taskTime = this.convertToDate(updateTaskDto.time);
      if (!this.checkTime(taskTime)) {
        throw new BadRequestException(
          'Updated task time must be in the future',
        );
      }
      this.tasks[taskIndex].time = taskTime;
    }

    Object.assign(this.tasks[taskIndex], updateTaskDto);
    console.log(this.tasks);
    return `Task #${id} updated successfully`;
  }

  remove(id: string): string {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(taskIndex, 1);
    return `Task #${id} removed successfully`;
  }
}
