import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { MaterialMovementType } from '@prisma/client';

export class CreateMaterialMovementDto {
  @IsUUID()
  chantierId!: string;

  @IsUUID()
  materialId!: string;

  @IsEnum(MaterialMovementType)
  type!: MaterialMovementType;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitCost?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
