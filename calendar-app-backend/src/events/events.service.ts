import { Injectable } from '@nestjs/common';
import { Event } from './event.entity';
import { CreateEventDto } from './create-event.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventsService {
  private events: Event[] = [];

  findAll(): Event[] {
    return this.events;
  }

  findOne(id: string): Event {
    return this.events.find(event => event.id === id);
  }

  create(createEventDto: CreateEventDto): Event {
    const event: Event = {
      id: uuidv4(),
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
      notificationTime: new Date(createEventDto.notificationTime),
    };
    this.events.push(event);
    return event;
  }

  update(id: string, updateEventDto: Partial<CreateEventDto>): Event {
    const event = this.findOne(id);
    if (!event) {
      return null;
    }
    Object.assign(event, updateEventDto);
    return event;
  }

  remove(id: string): boolean {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) {
      return false;
    }
    this.events.splice(index, 1);
    return true;
  }
}