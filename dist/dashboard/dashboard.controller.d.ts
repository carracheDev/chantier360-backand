import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { DashboardService } from './dashboard.service.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    overview(user: AuthenticatedRequestUser): Promise<{
        summary: {
            totalChantiers: number;
            statusCounts: {};
            totalBudget: import("@prisma/client/runtime/library").Decimal;
            validatedExpenses: import("@prisma/client/runtime/library").Decimal;
            remainingBudget: import("@prisma/client/runtime/library").Decimal;
            averageProgress: import("@prisma/client/runtime/library").Decimal;
            alertCount: number;
        };
        projects: never[];
        alerts: never[];
    } | {
        summary: {
            totalChantiers: number;
            statusCounts: Record<string, number>;
            totalBudget: import("@prisma/client/runtime/library").Decimal;
            validatedExpenses: import("@prisma/client/runtime/library").Decimal;
            remainingBudget: import("@prisma/client/runtime/library").Decimal;
            averageProgress: import("@prisma/client/runtime/library").Decimal;
            alertCount: number;
        };
        projects: {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.ChantierStatus;
            progress: import("@prisma/client/runtime/library").Decimal;
            budget: import("@prisma/client/runtime/library").Decimal;
            validatedExpenses: import("@prisma/client/runtime/library").Decimal;
            remainingBudget: import("@prisma/client/runtime/library").Decimal;
            consumedPercent: import("@prisma/client/runtime/library").Decimal;
            variance: import("@prisma/client/runtime/library").Decimal;
            alerts: import("./dashboard.service.js").DashboardAlert[];
        }[];
        alerts: import("./dashboard.service.js").DashboardAlert[];
    }>;
}
