import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsArray,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string; // Represents the date of the event

  @IsNotEmpty()
  @IsString()
  startTime: string; // Time of the event start

  @IsNotEmpty()
  @IsString()
  endTime: string; // Time of the event end

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos: string[];

  @ValidateIf((o) => o.date && o.startTime)
  validateTimes() {
    const eventDate = new Date(this.date);
    const startTime = this.startTime.split(':');
    const endTime = this.endTime.split(':');

    const startDateTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      parseInt(startTime[0]),
      parseInt(startTime[1]),
    );
    const endDateTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      parseInt(endTime[0]),
      parseInt(endTime[1]),
    );

    if (startDateTime >= endDateTime) {
      throw new Error('End time must be after start time');
    }
  }
}
