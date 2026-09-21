import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReportDto } from './dto/create-report.dto.js';

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
} satisfies Prisma.ReportSelect;

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string, userId: string, chantierId?: string) {
    return this.prisma.report.findMany({
      where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
      orderBy: { createdAt: 'desc' },
      select: reportSelect,
    });
  }

  async generate(companyId: string, userId: string, input: CreateReportDto) {
    const periodStart = new Date(input.periodStart);
    const periodEnd = new Date(input.periodEnd);
    if (periodEnd < periodStart) throw new BadRequestException('La période de fin doit être postérieure à la période de début.');
    await this.assertMembership(companyId, userId, input.chantierId);

    const report = await this.prisma.report.create({
      data: { companyId, chantierId: input.chantierId, userId, type: input.type, periodStart, periodEnd },
      select: reportSelect,
    });
    const data = await this.buildPeriodData(companyId, input.chantierId, periodStart, periodEnd);
    return { report, data };
  }

  /**
   * Détail d'un rapport existant : reconstruit la synthèse de la période enregistrée
   * sans créer de nouvelle ligne (lecture seule, permission report.read).
   */
  async findOne(companyId: string, userId: string, reportId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, companyId, chantier: { projectMembers: { some: { companyId, userId } } } },
      select: reportSelect,
    });
    if (!report) throw new NotFoundException('Rapport introuvable ou inaccessible.');

    const data = await this.buildPeriodData(companyId, report.chantierId, report.periodStart, report.periodEnd);
    return { report, data };
  }

  /** Agrégation d'une période : dépenses validées, matériaux, journaux, présences et incidents. */
  private async buildPeriodData(companyId: string, chantierId: string, periodStart: Date, periodEnd: Date) {
    const [chantier, expenses, movements, journals, attendances, incidents] = await Promise.all([
      this.prisma.chantier.findFirst({ where: { id: chantierId, companyId }, select: { id: true, name: true, budget: true, progress: true, status: true } }),
      this.prisma.expense.findMany({ where: { companyId, chantierId, status: ExpenseStatus.VALIDEE, date: { gte: periodStart, lte: periodEnd } }, select: { id: true, category: true, amount: true, date: true, description: true } }),
      this.prisma.materialMovement.findMany({ where: { companyId, chantierId, date: { gte: periodStart, lte: periodEnd } }, select: { id: true, type: true, quantity: true, unitCost: true, date: true, reference: true, material: { select: { id: true, name: true, unit: true } } } }),
      this.prisma.journalEntry.findMany({ where: { companyId, chantierId, date: { gte: periodStart, lte: periodEnd } }, select: { id: true, date: true, progress: true, description: true, weather: true, observations: true, status: true, photos: { select: { id: true, url: true, caption: true } } } }),
      this.prisma.attendance.findMany({ where: { companyId, chantierId, date: { gte: periodStart, lte: periodEnd } }, select: { id: true, workerId: true, date: true, status: true, hours: true, worker: { select: { name: true, function: true } } } }),
      this.prisma.incident.findMany({ where: { companyId, chantierId, createdAt: { gte: periodStart, lte: periodEnd } }, select: { id: true, title: true, description: true, severity: true, status: true, createdAt: true } }),
    ]);
    if (!chantier) throw new NotFoundException('Chantier introuvable.');

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

  private async assertMembership(companyId: string, userId: string, chantierId: string) {
    const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
    if (!membership) throw new NotFoundException('Chantier ou affectation introuvable.');
  }
}
