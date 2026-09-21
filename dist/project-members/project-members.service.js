var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let ProjectMembersService = class ProjectMembersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId) {
        return this.prisma.projectMember.findMany({
            where: { companyId },
            orderBy: { assignedAt: 'desc' },
            select: {
                userId: true,
                chantierId: true,
                assignedAt: true,
                user: { select: { id: true, name: true, email: true, active: true } },
                chantier: { select: { id: true, name: true, status: true } },
            },
        });
    }
    async findCandidates(companyId) {
        const [users, chantiers] = await Promise.all([
            this.prisma.user.findMany({
                where: { companyId, active: true },
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    userRoles: { select: { role: { select: { id: true, name: true } } } },
                },
            }),
            this.prisma.chantier.findMany({
                where: { companyId },
                orderBy: { name: 'asc' },
                select: { id: true, name: true, status: true },
            }),
        ]);
        return {
            users: users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.userRoles.map((userRole) => userRole.role),
            })),
            chantiers,
        };
    }
    async assign(companyId, input) {
        const [user, chantier] = await Promise.all([
            this.prisma.user.findFirst({ where: { id: input.userId, companyId, active: true }, select: { id: true } }),
            this.prisma.chantier.findFirst({ where: { id: input.chantierId, companyId }, select: { id: true } }),
        ]);
        if (!user || !chantier)
            throw new NotFoundException('Utilisateur ou chantier introuvable dans l’entreprise.');
        return this.prisma.projectMember.upsert({
            where: { userId_chantierId: { userId: input.userId, chantierId: input.chantierId } },
            update: {},
            create: { companyId, userId: input.userId, chantierId: input.chantierId },
            select: { userId: true, chantierId: true, assignedAt: true },
        });
    }
    async remove(companyId, userId, chantierId) {
        const result = await this.prisma.projectMember.deleteMany({ where: { companyId, userId, chantierId } });
        if (result.count === 0)
            throw new NotFoundException('Affectation introuvable.');
        return { removed: true };
    }
};
ProjectMembersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProjectMembersService);
export { ProjectMembersService };
//# sourceMappingURL=project-members.service.js.map