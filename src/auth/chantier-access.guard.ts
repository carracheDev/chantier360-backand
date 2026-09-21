import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthenticatedRequestUser } from './auth.types.js';

type RequestWithContext = {
  params: { chantierId?: string; id?: string };
  body?: { chantierId?: string };
  user?: AuthenticatedRequestUser;
};

@Injectable()
export class ChantierAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const user = request.user;
    const chantierId = request.params.chantierId ?? request.params.id ?? request.body?.chantierId;

    if (!user) throw new UnauthorizedException('Utilisateur authentifié requis.');
    if (!chantierId) throw new ForbiddenException('Identifiant chantier requis.');

    const membership = await this.prisma.projectMember.findFirst({
      where: {
        userId: user.id,
        companyId: user.companyId,
        chantierId,
        chantier: { companyId: user.companyId },
      },
      select: { userId: true },
    });

    if (!membership) {
      throw new ForbiddenException('Accès à ce chantier non autorisé.');
    }

    return true;
  }
}
