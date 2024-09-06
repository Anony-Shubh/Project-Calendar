import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

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
