import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service.js';
import { REQUIRED_PERMISSIONS_KEY } from './permissions.decorator.js';
import type { AuthenticatedRequestUser } from './auth.types.js';

type RequestWithUser = { user?: AuthenticatedRequestUser };

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(REQUIRED_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];

    if (required.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) throw new UnauthorizedException('Utilisateur authentifié requis.');

    const record = await this.prisma.user.findFirst({
      where: { id: user.id, companyId: user.companyId, active: true },
      select: {
        userRoles: {
          select: {
            role: {
              select: {
                rolePermissions: {
                  select: { permission: { select: { code: true } } },
                },
              },
            },
          },
        },
      },
    });

    const granted = new Set(
      record?.userRoles.flatMap((userRole) =>
        userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.code),
      ),
    );

    if (!required.every((permission) => granted.has(permission))) {
      throw new ForbiddenException('Permission insuffisante.');
    }

    return true;
  }
}
