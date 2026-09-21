var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId) {
        return this.prisma.role.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                description: true,
                _count: { select: { userRoles: true, rolePermissions: true } },
            },
        });
    }
    async create(companyId, input) {
        try {
            return await this.prisma.role.create({
                data: {
                    companyId,
                    name: input.name.trim().toUpperCase(),
                    description: input.description?.trim(),
                },
                select: { id: true, name: true, description: true },
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Ce rôle existe déjà dans l’entreprise.');
            }
            throw error;
        }
    }
};
RolesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], RolesService);
export { RolesService };
//# sourceMappingURL=roles.service.js.map