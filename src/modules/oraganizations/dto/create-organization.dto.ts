import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  adminPassword: string;
}