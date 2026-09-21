import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify } from 'jose';
import { AuthenticatedRequestUser } from './auth.types.js';

type RequestWithUser = {
  headers: { authorization?: string };
  user?: AuthenticatedRequestUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET est obligatoire pour vérifier les tokens.');
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorization = request.headers.authorization;
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Token Bearer requis.');
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
        algorithms: ['HS256'],
      });
      if (typeof payload.sub !== 'string' || typeof payload.companyId !== 'string' || typeof payload.email !== 'string') {
        throw new UnauthorizedException('Token invalide.');
      }

      request.user = {
        id: payload.sub,
        sub: payload.sub,
        companyId: payload.companyId,
        email: payload.email,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré.');
    }
  }
}
