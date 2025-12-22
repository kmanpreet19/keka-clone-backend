import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SendInvitationDto } from './dto/send-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../shared/mail/mail.service';

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService,
     private readonly mailService: MailService,
  ) {}

  async sendInvitation(adminId: string, dto: SendInvitationDto) {
    // 1. Get admin's organization
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: { organization: true },
    });

    if (!admin?.organizationId) {
      throw new BadRequestException('Admin must belong to an organization');
    }

    // 2. Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // 3. Check if pending invitation exists
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        email: dto.email,
        organizationId: admin.organizationId,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      throw new BadRequestException('Invitation already sent to this email');
    }

    // 4. Create invitation with token
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days validity

    const invitation = await this.prisma.invitation.create({
      data: {
        email: dto.email,
        token,
        role: dto.role,
        status: 'PENDING',
        expiresAt,
        organizationId: admin.organizationId,
      },
    });

    console.log(`Invitation sent to ${dto.email}`);
    console.log(`Token: ${token}`);

// 5. Send invitation email
const acceptLink = `http://localhost:3000/invitations/accept?token=${token}`;

await this.mailService.sendInvitation(dto.email, acceptLink);
 return {
      message: 'Invitation sent successfully',
      invitationId: invitation.id,
      email: invitation.email,
      expiresAt: invitation.expiresAt,
    };
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    // 1. Find invitation by token
    const invitation = await this.prisma.invitation.findUnique({
      where: { token: dto.token },
    });

    if (!invitation) {
      throw new NotFoundException('Invalid invitation token');
    }

    // 2. Check if already accepted
    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestException('Invitation already accepted');
    }

    // 3. Check if expired
    if (new Date() > invitation.expiresAt) {
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Invitation has expired');
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 5. Create user + employee in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: invitation.email,
          password: hashedPassword,
          role: invitation.role,
          organizationId: invitation.organizationId,
          isActive: true,
        },
      });

      // Create employee profile
      const employeeCode = `EMP${Date.now().toString().slice(-6)}`;
      const employee = await tx.employee.create({
        data: {
          fullName: dto.fullName,
          employeeCode,
          userId: user.id,
        },
      });

      // Mark invitation as accepted
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      });

      return { user, employee };
    });

    return {
      message: 'Account created successfully',
      email: result.user.email,
      role: result.user.role,
      employeeCode: result.employee.employeeCode,
    };
  }

  async getInvitationsByOrganization(organizationId: string) {
    return this.prisma.invitation.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}