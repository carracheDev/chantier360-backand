import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreatePhotoDto {
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  caption?: string;
}
