var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
const chantierSelect = {
    id: true,
    companyId: true,
    name: true,
    description: true,
    location: true,
    budget: true,
    progress: true,
    startDate: true,
    endDate: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    _count: { select: { projectMembers: true, expenses: true, workers: true, incidents: true } },
};
let ChantiersService = class ChantiersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAllForUser(companyId, userId) {
        return this.prisma.chantier.findMany({
            where: { companyId, projectMembers: { some: { userId, companyId } } },
            orderBy: { createdAt: 'desc' },
            select: chantierSelect,
        });
    }
    async findOne(companyId, chantierId) {
        const chantier = await this.prisma.chantier.findFirst({
            where: { id: chantierId, companyId },
            select: chantierSelect,
        });
        if (!chantier)
            throw new NotFoundException('Chantier introuvable.');
        return chantier;
    }
    async create(companyId, userId, input) {
        this.validateDates(input.startDate, input.endDate);
        return this.prisma.$transaction(async (transaction) => {
            const chantier = await transaction.chantier.create({
                data: {
                    companyId,
                    name: input.name.trim(),
                    description: input.description?.trim(),
                    location: input.location?.trim(),
                    budget: input.budget.toString(),
                    progress: (input.progress ?? 0).toString(),
                    startDate: new Date(input.startDate),
                    endDate: input.endDate ? new Date(input.endDate) : undefined,
                    status: input.status,
                },
                select: chantierSelect,
            });
            await transaction.projectMember.create({
                data: { companyId, userId, chantierId: chantier.id },
            });
            return chantier;
        });
    }
    async update(companyId, chantierId, input) {
        const current = await this.prisma.chantier.findFirst({
            where: { id: chantierId, companyId },
            select: { startDate: true, endDate: true },
        });
        if (!current)
            throw new NotFoundException('Chantier introuvable.');
        const startDate = input.startDate ?? current.startDate.toISOString();
        const endDate = input.endDate ?? current.endDate?.toISOString();
        this.validateDates(startDate, endDate);
        return this.prisma.chantier.update({
            where: { id: chantierId },
            data: {
                name: input.name?.trim(),
                description: input.description?.trim(),
                location: input.location?.trim(),
                budget: input.budget === undefined ? undefined : input.budget.toString(),
                progress: input.progress === undefined ? undefined : input.progress.toString(),
                startDate: input.startDate ? new Date(input.startDate) : undefined,
                endDate: input.endDate ? new Date(input.endDate) : undefined,
                status: input.status,
            },
            select: chantierSelect,
        });
    }
    validateDates(startDate, endDate) {
        if (endDate && new Date(endDate) < new Date(startDate)) {
            throw new BadRequestException('La date de fin doit être postérieure à la date de début.');
        }
    }
};
ChantiersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ChantiersService);
export { ChantiersService };
//# sourceMappingURL=chantiers.service.js.map