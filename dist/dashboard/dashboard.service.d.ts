import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
export type DashboardAlert = {
    type: 'BUDGET' | 'RETARD' | 'STOCK';
    severity: 'WARNING' | 'CRITICAL';
    chantierId: string;
    chantierName: string;
    message: string;
    materialId?: string;
};
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverview(companyId: string, userId: string): Promise<{
        summary: {
            totalChantiers: number;
            statusCounts: {};
            totalBudget: Prisma.Decimal;
            validatedExpenses: Prisma.Decimal;
            remainingBudget: Prisma.Decimal;
            averageProgress: Prisma.Decimal;
            alertCount: number;
        };
        projects: never[];
        alerts: never[];
    } | {
        summary: {
            totalChantiers: number;
            statusCounts: Record<string, number>;
            totalBudget: Prisma.Decimal;
            validatedExpenses: Prisma.Decimal;
            remainingBudget: Prisma.Decimal;
            averageProgress: Prisma.Decimal;
            alertCount: number;
        };
        projects: {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.ChantierStatus;
            progress: Prisma.Decimal;
            budget: Prisma.Decimal;
            validatedExpenses: Prisma.Decimal;
            remainingBudget: Prisma.Decimal;
            consumedPercent: Prisma.Decimal;
            variance: Prisma.Decimal;
            alerts: DashboardAlert[];
        }[];
        alerts: DashboardAlert[];
    }>;
    private emptyOverview;
}
