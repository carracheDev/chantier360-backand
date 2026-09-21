import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { SignJWT } from 'jose';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthenticatedRequestUser } from './auth.types.js';
import { LoginDto } from './dto/login.dto.js';

export type AuthenticatedUser = Pick<User, 'id' | 'companyId' | 'name' | 'email'>;

export type AuthenticatedUserProfile = AuthenticatedUser & {
  phone: string | null;
  active: boolean;
  roles: { id: string; name: string; description: string | null }[];
  permissions: string[];
};

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(input: LoginDto): Promise<{ accessToken: string; user: AuthenticatedUser }> {
    const user = await this.prisma.user.findFirst({
      where: {
        companyId: input.companyId,
        email: input.email.trim().toLowerCase(),
        active: true,
      },
    });

    if (!user || !(await argon2.verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET est obligatoire pour signer les tokens.');
    }

    const accessToken = await new SignJWT({
      companyId: user.companyId,
      email: user.email,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_ACCESS_EXPIRES_IN ?? '15m')
      .sign(new TextEncoder().encode(secret));

    return {
      accessToken,
      user: {
        id: user.id,
        companyId: user.companyId,
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Profil de l'utilisateur courant, enrichi des rôles et des codes de permission.
   * Nécessaire au back-office web pour n'afficher que les actions réellement autorisées.
   */
  async findProfile(user: AuthenticatedRequestUser): Promise<AuthenticatedUserProfile> {
    const record = await this.prisma.user.findFirst({
      where: { id: user.id, companyId: user.companyId, active: true },
      select: {
        id: true,
        companyId: true,
        name: true,
        email: true,
        phone: true,
        active: true,
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                rolePermissions: { select: { permission: { select: { code: true } } } },
              },
            },
          },
        },
      },
    });

    if (!record) throw new UnauthorizedException('Utilisateur introuvable ou inactif.');

    const roles = record.userRoles.map((userRole) => ({
      id: userRole.role.id,
      name: userRole.role.name,
      description: userRole.role.description,
    }));
    const permissions = [...new Set(
      record.userRoles.flatMap((userRole) => userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.code)),
    )].sort();

    return {
      id: record.id,
      companyId: record.companyId,
      name: record.name,
      email: record.email,
      phone: record.phone,
      active: record.active,
      roles,
      permissions,
    };
  }
}
