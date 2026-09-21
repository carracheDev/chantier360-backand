import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { DashboardService } from '../dashboard/dashboard.service.js';
export declare class AlertsController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    findAll(user: AuthenticatedRequestUser): Promise<{
        alerts: never[] | import("../dashboard/dashboard.service.js").DashboardAlert[];
        count: number;
    }>;
}
