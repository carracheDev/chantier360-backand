var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { ChantierStatus, ExpenseStatus, MaterialMovementType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(companyId, userId) {
        const chantiers = await this.prisma.chantier.findMany({
            where: { companyId, projectMembers: { some: { companyId, userId } } },
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, budget: true, progress: true, status: true, endDate: true },
        });
        const chantierIds = chantiers.map((chantier) => chantier.id);
        if (chantierIds.length === 0)
            return this.emptyOverview();
        const [expenses, movements] = await Promise.all([
            this.prisma.expense.findMany({
                where: { companyId, chantierId: { in: chantierIds }, status: ExpenseStatus.VALIDEE },
                select: { chantierId: true, amount: true },
            }),
            this.prisma.materialMovement.findMany({
                where: { companyId, chantierId: { in: chantierIds } },
                select: {
                    chantierId: true,
                    materialId: true,
                    type: true,
                    quantity: true,
                    material: { select: { id: true, name: true, unit: true, minimumStock: true } },
                },
            }),
        ]);
        const expenseTotals = new Map();
        for (const expense of expenses) {
            expenseTotals.set(expense.chantierId, (expenseTotals.get(expense.chantierId) ?? new Prisma.Decimal(0)).plus(expense.amount));
        }
        const stockTotals = new Map();
        for (const movement of movements) {
            const key = `${movement.chantierId}:${movement.materialId}`;
            const current = stockTotals.get(key) ?? {
                chantierId: movement.chantierId,
                materialId: movement.materialId,
                name: movement.material.name,
                unit: movement.material.unit,
                minimumStock: new Prisma.Decimal(movement.material.minimumStock),
                stock: new Prisma.Decimal(0),
            };
            current.stock = current.stock.plus(movement.type === MaterialMovementType.ENTREE ? movement.quantity : new Prisma.Decimal(movement.quantity).negated());
            stockTotals.set(key, current);
        }
        const today = new Date();
        const alerts = [];
        const projects = chantiers.map((chantier) => {
            const budget = new Prisma.Decimal(chantier.budget);
            const validatedExpenses = expenseTotals.get(chantier.id) ?? new Prisma.Decimal(0);
            const consumedPercent = budget.isZero() ? new Prisma.Decimal(0) : validatedExpenses.div(budget).mul(100);
            const projectAlerts = [];
            const variance = consumedPercent.minus(chantier.progress);
            if (variance.greaterThan(10)) {
                projectAlerts.push({ type: 'BUDGET', severity: 'WARNING', chantierId: chantier.id, chantierName: chantier.name, message: 'La consommation budgétaire dépasse significativement l’avancement.' });
            }
            if (chantier.endDate && chantier.endDate < today && new Prisma.Decimal(chantier.progress).lessThan(100) && chantier.status !== ChantierStatus.TERMINE && chantier.status !== ChantierStatus.ANNULE) {
                projectAlerts.push({ type: 'RETARD', severity: 'CRITICAL', chantierId: chantier.id, chantierName: chantier.name, message: 'La date de fin prévue est dépassée et le chantier n’est pas terminé.' });
            }
            for (const stock of stockTotals.values()) {
                if (stock.chantierId === chantier.id && stock.stock.lessThan(stock.minimumStock)) {
                    projectAlerts.push({ type: 'STOCK', severity: 'WARNING', chantierId: chantier.id, chantierName: chantier.name, materialId: stock.materialId, message: `Stock faible : ${stock.name} (${stock.stock.toString()} ${stock.unit}).` });
                }
            }
            alerts.push(...projectAlerts);
            return {
                id: chantier.id,
                name: chantier.name,
                status: chantier.status,
                progress: chantier.progress,
                budget,
                validatedExpenses,
                remainingBudget: budget.minus(validatedExpenses),
                consumedPercent,
                variance,
                alerts: projectAlerts,
            };
        });
        const totalBudget = projects.reduce((total, project) => total.plus(project.budget), new Prisma.Decimal(0));
        const totalExpenses = projects.reduce((total, project) => total.plus(project.validatedExpenses), new Prisma.Decimal(0));
        const totalProgress = projects.reduce((total, project) => total.plus(project.progress), new Prisma.Decimal(0));
        const statusCounts = Object.values(ChantierStatus).reduce((counts, status) => {
            counts[status] = chantiers.filter((chantier) => chantier.status === status).length;
            return counts;
        }, {});
        return {
            summary: {
                totalChantiers: chantiers.length,
                statusCounts,
                totalBudget,
                validatedExpenses: totalExpenses,
                remainingBudget: totalBudget.minus(totalExpenses),
                averageProgress: totalProgress.div(chantiers.length),
                alertCount: alerts.length,
            },
            projects,
            alerts,
        };
    }
    emptyOverview() {
        const zero = new Prisma.Decimal(0);
        return {
            summary: { totalChantiers: 0, statusCounts: {}, totalBudget: zero, validatedExpenses: zero, remainingBudget: zero, averageProgress: zero, alertCount: 0 },
            projects: [],
            alerts: [],
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map