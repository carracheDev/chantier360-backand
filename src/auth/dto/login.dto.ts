import { IsEmail, IsUUID, MinLength } from 'class-validator';

export class LoginDto {
  @IsUUID()
  companyId!: string;

  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}
