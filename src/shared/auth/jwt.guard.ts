import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    console.log('🔐 JwtAuthGuard HIT');
    console.log('➡️  URL:', req.method, req.url);
    console.log('➡️  Authorization Header:', req.headers['authorization']);

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      console.log('🟢 Public route detected');
      
      // If there's an Authorization header, still validate it
      if (req.headers['authorization']) {
        console.log('🔑 JWT token found, validating...');
        return super.canActivate(context); // Validate JWT
      }
      
      console.log('⚪ No JWT token, allowing anonymous access');
      return true; // Allow access without JWT
    }

    console.log('🔒 Protected route, JWT required');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const req = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If public route and no user, that's fine
    if (isPublic && !user) {
      console.log('⚪ Public route, no user extracted');
      return null; // No user, but that's OK
    }

    // For protected routes, user is required
    if (err || !user) {
      console.log('❌ JWT validation failed:', info?.message || err?.message);
      throw err || new Error('Unauthorized');
    }

    console.log('✅ JWT validated, user:', user.email);
    return user;
  }
}