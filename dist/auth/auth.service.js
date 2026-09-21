var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SignJWT } from 'jose';
import { PrismaService } from '../prisma/prisma.service.js';
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(input) {
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
    async findProfile(user) {
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
        if (!record)
            throw new UnauthorizedException('Utilisateur introuvable ou inactif.');
        const roles = record.userRoles.map((userRole) => ({
            id: userRole.role.id,
            name: userRole.role.name,
            description: userRole.role.description,
        }));
        const permissions = [...new Set(record.userRoles.flatMap((userRole) => userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.code)))].sort();
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
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map