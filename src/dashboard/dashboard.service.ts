import { Injectable } from '@nestjs/common';
import { ChantierStatus, ExpenseStatus, MaterialMovementType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

export type DashboardAlert = {
  type: 'BUDGET' | 'RETARD' | 'STOCK';
  severity: 'WARNING' | 'CRITICAL';
  chantierId: string;
  chantierName: string;
  message: string;
  materialId?: string;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(companyId: string, userId: string) {
    const chantiers = await this.prisma.chantier.findMany({
      where: { companyId, projectMembers: { some: { companyId, userId } } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, budget: true, progress: true, status: true, endDate: true },
    });
    const chantierIds = chantiers.map((chantier) => chantier.id);
    if (chantierIds.length === 0) return this.emptyOverview();

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

    const expenseTotals = new Map<string, Prisma.Decimal>();
    for (const expense of expenses) {
      expenseTotals.set(expense.chantierId, (expenseTotals.get(expense.chantierId) ?? new Prisma.Decimal(0)).plus(expense.amount));
    }

    const stockTotals = new Map<string, { chantierId: string; materialId: string; name: string; unit: string; minimumStock: Prisma.Decimal; stock: Prisma.Decimal }>();
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
    const alerts: DashboardAlert[] = [];
    const projects = chantiers.map((chantier) => {
      const budget = new Prisma.Decimal(chantier.budget);
      const validatedExpenses = expenseTotals.get(chantier.id) ?? new Prisma.Decimal(0);
      const consumedPercent = budget.isZero() ? new Prisma.Decimal(0) : validatedExpenses.div(budget).mul(100);
      const projectAlerts: DashboardAlert[] = [];
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
    const statusCounts = Object.values(ChantierStatus).reduce<Record<string, number>>((counts, status) => {
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

  private emptyOverview() {
    const zero = new Prisma.Decimal(0);
    return {
      summary: { totalChantiers: 0, statusCounts: {}, totalBudget: zero, validatedExpenses: zero, remainingBudget: zero, averageProgress: zero, alertCount: 0 },
      projects: [],
      alerts: [],
    };
  }
}
