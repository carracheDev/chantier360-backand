import { Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreateAttendanceDto {
  @IsUUID()
  chantierId!: string;

  @IsUUID()
  workerId!: string;

  @IsDateString()
  date!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(24)
  hours?: number;
}
