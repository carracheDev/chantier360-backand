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
const incidentSelect = {
    id: true,
    companyId: true,
    chantierId: true,
    userId: true,
    title: true,
    description: true,
    severity: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    user: { select: { id: true, name: true, email: true } },
};
let IncidentsService = class IncidentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId, userId, chantierId) {
        return this.prisma.incident.findMany({
            where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
            orderBy: { createdAt: 'desc' },
            select: incidentSelect,
        });
    }
    async create(companyId, userId, input) {
        await this.assertMembership(companyId, userId, input.chantierId);
        return this.prisma.incident.create({
            data: {
                companyId,
                chantierId: input.chantierId,
                userId,
                title: input.title.trim(),
                description: input.description.trim(),
                severity: input.severity,
            },
            select: incidentSelect,
        });
    }
    async update(companyId, userId, incidentId, input) {
        await this.findAccessible(companyId, userId, incidentId);
        return this.prisma.incident.update({
            where: { id: incidentId },
            data: {
                title: input.title?.trim(),
                description: input.description?.trim(),
                severity: input.severity,
                status: input.status,
            },
            select: incidentSelect,
        });
    }
    async assertMembership(companyId, userId, chantierId) {
        const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
        if (!membership)
            throw new NotFoundException('Chantier ou affectation introuvable.');
    }
    async findAccessible(companyId, userId, incidentId) {
        const incident = await this.prisma.incident.findFirst({
            where: { id: incidentId, companyId, chantier: { companyId, projectMembers: { some: { companyId, userId } } } },
            select: { id: true },
        });
        if (!incident)
            throw new NotFoundException('Incident introuvable ou inaccessible.');
        return incident;
    }
};
IncidentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], IncidentsService);
export { IncidentsService };
//# sourceMappingURL=incidents.service.js.map