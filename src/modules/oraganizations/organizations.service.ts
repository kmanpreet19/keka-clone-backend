import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(dto: CreateOrganizationDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
    });

    if (existingUser) {
      throw new BadRequestException('Admin email already in use');
    }

    // Check if organization domain exists
    if (dto.domain) {
      const existingOrg = await this.prisma.organization.findUnique({
        where: { domain: dto.domain },
      });

      if (existingOrg) {
        throw new BadRequestException('Organization domain already exists');
      }
    }

    // Create organization + admin in transaction
    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: dto.name,
          domain: dto.domain,
        },
      });

      // Create admin user
      const admin = await tx.user.create({
        data: {
          email: dto.adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          organizationId: organization.id,
          isActive: true,
        },
      });

      return { organization, admin };
    });

    return {
      message: 'Organization and admin created successfully',
      organization: {
        id: result.organization.id,
        name: result.organization.name,
      },
      admin: {
        email: result.admin.email,
      },
    };
  }
}