import { IsEnum } from 'class-validator';
import { ExpenseStatus } from '@prisma/client';

export class ValidateExpenseDto {
  @IsEnum(ExpenseStatus)
  status!: ExpenseStatus;
}
