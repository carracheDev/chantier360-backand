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
import { ExpenseStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
const reportSelect = {
    id: true,
    companyId: true,
    chantierId: true,
    userId: true,
    type: true,
    periodStart: true,
    periodEnd: true,
    fileUrl: true,
    createdAt: true,
};
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId, userId, chantierId) {
        return this.prisma.report.findMany({
            where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
            orderBy: { createdAt: 'desc' },
            select: reportSelect,
        });
    }
    async generate(companyId, userId, input) {
        const periodStart = new Date(input.periodStart);
        const periodEnd = new Date(input.periodEnd);
        if (periodEnd < periodStart)
            throw new BadRequestException('La période de fin doit être postérieure à la période de début.');
        await this.assertMembership(companyId, userId, input.chantierId);
        const report = await this.prisma.report.create({
            data: { companyId, chantierId: input.chantierId, userId, type: input.type, periodStart, periodEnd },
            select: reportSelect,
        });
        const data = await this.buildPeriodData(companyId, input.chantierId, periodStart, periodEnd);
        return { report, data };
    }
    async findOne(companyId, userId, reportId) {
        const report = await this.prisma.report.findFirst({
            where: { id: reportId, companyId, chantier: { projectMembers: { some: { companyId, userId } } } },
            select: reportSelect,
        });
        if (!report)
            throw new NotFoundException('Rapport introuvable ou inaccessible.');
        const data = await this.buildPeriodData(companyId, report.chantierId, report.periodStart, report.periodEnd);
        return { report, data };
    }
    async buildPeriodData(companyId, chantierId, periodStart, periodEnd) {
        const [chantier, expenses, movements, journals, attendances, incidents] = await Promise.all([
            this.prisma.chantier.findFirst({ where: { id: chantierId, companyId }, select: { id: true, name: true, budget: true, progress: true, status: true } }),
            this.prisma.expense.findMany({ where: { companyId, chantierId, status: ExpenseStatus.VALIDEE, date: { gte: periodStart, lte: periodEnd } }, select: { id: true, category: true, amount: true, date: true, description: true } }),
            this.prisma.materialMovement.findMany({ where: { companyId, chantierId, date: { gte: periodStart, lte: periodEnd } }, select: { id: true, type: true, quantity: true, unitCost: true, date: true, reference: true, material: { select: { id: true, name: true, unit: true } } } }),
            this.prisma.journalEntry.findMany({ where: { companyId, chantierId, date: { gte: periodStart, lte: periodEnd } }, select: { id: true, date: true, progress: true, description: true, weather: true, observations: true, status: true, photos: { select: { id: true, url: true, caption: true } } } }),
            this.prisma.attendance.findMany({ where: { companyId, chantierId, date: { gte: periodStart, lte: periodEnd } }, select: { id: true, workerId: true, date: true, status: true, hours: true, worker: { select: { name: true, function: true } } } }),
            this.prisma.incident.findMany({ where: { companyId, chantierId, createdAt: { gte: periodStart, lte: periodEnd } }, select: { id: true, title: true, description: true, severity: true, status: true, createdAt: true } }),
        ]);
        if (!chantier)
            throw new NotFoundException('Chantier introuvable.');
        const totalExpenses = expenses.reduce((total, expense) => total.plus(expense.amount), new Prisma.Decimal(0));
        return {
            chantier,
            expenses,
            totalValidatedExpenses: totalExpenses,
            movements,
            journals,
            attendances,
            incidents,
            export: { format: 'PDF', status: 'PENDING', fileUrl: null },
        };
    }
    async assertMembership(companyId, userId, chantierId) {
        const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
        if (!membership)
            throw new NotFoundException('Chantier ou affectation introuvable.');
    }
};
ReportsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ReportsService);
export { ReportsService };
//# sourceMappingURL=reports.service.js.map