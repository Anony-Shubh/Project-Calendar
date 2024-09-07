import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [EventsModule, TasksModule, ScheduleModule.forRoot()],
})
export class AppModule {}
