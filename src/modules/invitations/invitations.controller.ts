import { Controller, Post, Get, Body, Req, BadRequestException } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { SendInvitationDto } from './dto/send-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { Roles } from '../../shared/auth/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../../shared/auth/public.decorator';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('send')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async sendInvitation(@Req() req: any, 
  @Body() dto: SendInvitationDto,) {
    console.log('Admin sending invitation:', dto);
    return this.invitationsService.sendInvitation(req.user.id, dto);
  }

  @Public()
  @Post('accept')
  async acceptInvitation(@Body() dto: AcceptInvitationDto) {
    console.log('User accepting invitation');
    return this.invitationsService.acceptInvitation(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getInvitations(@Req() req: any) {
    const user = await this.invitationsService['prisma'].user.findUnique({
      where: { id: req.user.id },
    });

    if (!user || !user.organizationId) {
      throw new BadRequestException('User does not belong to an organization');
    }

    return this.invitationsService.getInvitationsByOrganization(
      user.organizationId,
    );
  }
}