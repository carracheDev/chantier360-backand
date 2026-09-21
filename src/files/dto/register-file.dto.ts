import { FileAssetKind } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class RegisterFileDto {
  @IsEnum(FileAssetKind)
  kind!: FileAssetKind;

  @IsString()
  storageKey!: string;

  @IsString()
  originalName!: string;

  @IsString()
  mimeType!: string;

  @IsInt()
  @Min(1)
  @Max(500_000_000)
  sizeBytes!: number;

  @IsOptional()
  @IsUUID()
  chantierId?: string;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsUUID()
  targetId?: string;
}
