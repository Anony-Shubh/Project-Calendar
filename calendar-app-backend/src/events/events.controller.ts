import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Event[] {
    return this.eventsService.findAll();
  }

  @Get('/date/:date')
  findAllForDate(@Param('date') date: string): Event[] {
    return this.eventsService.findAllForDate(date);
  }

  @Get('/count/:month/:year')
  findCountForMonth(
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.eventsService.findEventCountForMonth(
      parseInt(year),
      parseInt(month),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Event {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto): Event {
    return this.eventsService.create(createEventDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: Partial<CreateEventDto>,
  ): Event {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): boolean {
    return this.eventsService.remove(id);
  }
}
