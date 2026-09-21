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
import { PrismaService } from '../prisma/prisma.service.js';
let WorkersService = class WorkersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId, userId, chantierId) {
        return this.prisma.worker.findMany({
            where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
            orderBy: { name: 'asc' },
            select: { id: true, companyId: true, chantierId: true, name: true, function: true, phone: true, dailyRate: true, createdAt: true, updatedAt: true },
        });
    }
    async create(companyId, userId, input) {
        await this.assertMembership(companyId, userId, input.chantierId);
        try {
            return await this.prisma.worker.create({
                data: {
                    companyId,
                    chantierId: input.chantierId,
                    name: input.name.trim(),
                    function: input.function.trim(),
                    phone: input.phone?.trim(),
                    dailyRate: input.dailyRate?.toString(),
                },
                select: { id: true, companyId: true, chantierId: true, name: true, function: true, phone: true, dailyRate: true, createdAt: true, updatedAt: true },
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Ce travailleur est déjà enregistré.');
            }
            throw error;
        }
    }
    async assertMembership(companyId, userId, chantierId) {
        const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
        if (!membership)
            throw new NotFoundException('Chantier ou affectation introuvable.');
    }
};
WorkersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], WorkersService);
export { WorkersService };
//# sourceMappingURL=workers.service.js.map