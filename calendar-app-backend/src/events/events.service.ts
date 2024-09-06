import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { v4 as uuidv4 } from 'uuid';
import { parse, isSameDay } from 'date-fns';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private events: Event[] = [];
  private eventsPerDay: Map<string, number> = new Map();

  findAll(): Event[] {
    return this.events;
  }

  findOne(id: string): Event {
    return this.events.find((event) => event.id === id);
  }

  create(createEventDto: CreateEventDto): Event {
    const { date, startTime, endTime } = createEventDto;

    // Combine date with times to create Date objects
    const startDateTime = parse(
      `${date}T${startTime}`,
      "yyyy-MM-dd'T'HH:mm",
      new Date(),
    );
    const endDateTime = parse(
      `${date}T${endTime}`,
      "yyyy-MM-dd'T'HH:mm",
      new Date(),
    );

    // Validate if the Date objects are valid
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new HttpException(
        'Invalid start or end time',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if start and end times are on the same day
    if (!isSameDay(startDateTime, endDateTime)) {
      throw new HttpException(
        'Start time and end time must be on the same day',
        HttpStatus.BAD_REQUEST,
      );
    }

    const event: Event = {
      id: uuidv4(),
      date,
      startTime,
      endTime,
      title: createEventDto.title,
      description: createEventDto.description,
    };

    this.eventsPerDay.set(date, (this.eventsPerDay.get(date) ?? 0) + 1);

    // Add the event to the events list
    this.events.push(event);
    console.log(this.events);
    return event;
  }

  findAllForDate(date: string): Event[] {
    const parsedDate = new Date(date);

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      return []; // Return an empty array for invalid date
    }

    const targetDate = parsedDate.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'

    return this.events.filter((event) => {
      // Compare only the date part (YYYY-MM-DD)
      return event.date === targetDate;
    });
  }

  findEventCountForMonth(
    year: number,
    month: number,
  ): { [date: string]: number } {
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      throw new Error('Invalid year or month. Month must be between 1 and 12.');
    }

    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 0); // End of the month (last day of the month)

    const eventsCount: { [date: string]: number } = {};

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split('T')[0];
      eventsCount[dateStr] = this.eventsPerDay.get(dateStr) || 0;
    }

    return eventsCount;
  }

  update(id: string, updateEventDto: UpdateEventDto): Event {
    const { date, startTime, endTime, title, description } = updateEventDto;

    const eventIndex = this.events.findIndex((event) => event.id === id);
    if (eventIndex === -1) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    const startDateTime = parse(
      `${date}T${startTime}`,
      "yyyy-MM-dd'T'HH:mm",
      new Date(),
    );
    const endDateTime = parse(
      `${date}T${endTime}`,
      "yyyy-MM-dd'T'HH:mm",
      new Date(),
    );

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new HttpException(
        'Invalid start or end time',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isSameDay(startDateTime, endDateTime)) {
      throw new HttpException(
        'Start time and end time must be on the same day',
        HttpStatus.BAD_REQUEST,
      );
    }

    const oldEvent = this.events[eventIndex];
    const oldDate = oldEvent.date;

    const updatedEvent: Event = {
      id,
      date,
      startTime,
      endTime,
      title,
      description,
    };

    // Replace the old event with the updated one
    this.events[eventIndex] = updatedEvent;

    this.eventsPerDay.set(oldDate, (this.eventsPerDay.get(oldDate) ?? 1) - 1);
    if ((this.eventsPerDay.get(oldDate) ?? 0) <= 0) {
      this.eventsPerDay.delete(oldDate);
    }

    this.eventsPerDay.set(date, (this.eventsPerDay.get(date) ?? 0) + 1);

    return updatedEvent;
  }

  remove(id: string): boolean {
    const index = this.events.findIndex((event) => event.id === id);
    if (index === -1) {
      return false;
    }
    const eventDateStr = this.events[index].date;
    this.events.splice(index, 1);
    this.updateEventsPerDay(eventDateStr, -1);
    return true;
  }

  private updateEventsPerDay(dateStr: string, change: number): void {
    if (this.eventsPerDay.has(dateStr)) {
      const currentCount = this.eventsPerDay.get(dateStr);
      const newCount = (currentCount || 0) + change;

      if (newCount <= 0) {
        this.eventsPerDay.delete(dateStr);
      } else {
        this.eventsPerDay.set(dateStr, newCount);
      }
    } else if (change > 0) {
      this.eventsPerDay.set(dateStr, change);
    }
  }
}
