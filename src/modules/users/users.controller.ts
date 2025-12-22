import { Controller, Get, Req } from '@nestjs/common';
import { Roles } from '../../shared/auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {

  @Roles(Role.ADMIN)
  @Get()
  getAllUsers(@Req() req: any) {
    console.log('UsersController HIT');
    console.log('req.user:', req.user);
    
    return {
      message: 'ADMIN can access users list',
      user: req.user, // This will have the JWT payload
    };
  }

  // Add profile endpoint - any authenticated user can access
  @Get('profile')
  getProfile(@Req() req: any) {
    console.log('Profile endpoint HIT');
    console.log('req.user:', req.user);
    
    return {
      message: 'Your profile',
      user: req.user,
    };
  }

  // Add another endpoint - specific user details
  @Get('me')
  getCurrentUser(@Req() req: any) {
    return {
      userId: req.user.sub,
      email: req.user.email,
      role: req.user.role,
    };
  }
}