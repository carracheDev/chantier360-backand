var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
const publicUserSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    active: true,
    companyId: true,
    createdAt: true,
    updatedAt: true,
    userRoles: {
        select: { role: { select: { id: true, name: true, description: true } } },
    },
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId) {
        return this.prisma.user.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
            select: publicUserSelect,
        });
    }
    async create(companyId, input) {
        const email = input.email.trim().toLowerCase();
        const role = await this.prisma.role.findFirst({ where: { id: input.roleId, companyId } });
        if (!role)
            throw new NotFoundException('Rôle introuvable dans cette entreprise.');
        try {
            return await this.prisma.user.create({
                data: {
                    companyId,
                    name: input.name.trim(),
                    email,
                    phone: input.phone?.trim(),
                    passwordHash: await argon2.hash(input.password),
                    userRoles: { create: { roleId: role.id } },
                },
                select: publicUserSelect,
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Cette adresse email existe déjà dans l’entreprise.');
            }
            throw error;
        }
    }
    async setActive(companyId, userId, active) {
        const result = await this.prisma.user.updateMany({
            where: { id: userId, companyId },
            data: { active },
        });
        if (result.count === 0)
            throw new NotFoundException('Utilisateur introuvable.');
        return this.prisma.user.findFirst({ where: { id: userId, companyId }, select: publicUserSelect });
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map