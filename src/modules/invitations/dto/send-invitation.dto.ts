import { IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Role } from '@prisma/client';
   

export class SendInvitationDto {
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  designationId?: string;
}