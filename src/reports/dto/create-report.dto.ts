import { ReportType } from '@prisma/client';
import { IsDateString, IsEnum, IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsUUID()
  chantierId!: string;

  @IsEnum(ReportType)
  type!: ReportType;

  @IsDateString()
  periodStart!: string;

  @IsDateString()
  periodEnd!: string;
}
