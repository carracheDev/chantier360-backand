import { IsUUID } from 'class-validator';

export class AssignProjectMemberDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  chantierId!: string;
}
