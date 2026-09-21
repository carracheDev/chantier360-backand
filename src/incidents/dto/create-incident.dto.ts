import { IncidentSeverity } from '@prisma/client';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateIncidentDto {
  @IsUUID()
  chantierId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsEnum(IncidentSeverity)
  severity!: IncidentSeverity;
}
