import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { ReportsService } from './reports.service.js';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string): import("@prisma/client").Prisma.PrismaPromise<{
        companyId: string;
        id: string;
        createdAt: Date;
        userId: string | null;
        chantierId: string;
        type: import("@prisma/client").$Enums.ReportType;
        periodStart: Date;
        periodEnd: Date;
        fileUrl: string | null;
    }[]>;
    findOne(user: AuthenticatedRequestUser, reportId: string): Promise<{
        report: {
            companyId: string;
            id: string;
            createdAt: Date;
            userId: string | null;
            chantierId: string;
            type: import("@prisma/client").$Enums.ReportType;
            periodStart: Date;
            periodEnd: Date;
            fileUrl: string | null;
        };
        data: {
            chantier: {
                name: string;
                id: string;
                budget: import("@prisma/client/runtime/library").Decimal;
                progress: import("@prisma/client/runtime/library").Decimal;
                status: import("@prisma/client").$Enums.ChantierStatus;
            };
            expenses: {
                id: string;
                description: string | null;
                category: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                date: Date;
            }[];
            totalValidatedExpenses: import("@prisma/client/runtime/library").Decimal;
            movements: {
                material: {
                    name: string;
                    id: string;
                    unit: string;
                };
                id: string;
                date: Date;
                type: import("@prisma/client").$Enums.MaterialMovementType;
                quantity: import("@prisma/client/runtime/library").Decimal;
                unitCost: import("@prisma/client/runtime/library").Decimal | null;
                reference: string | null;
            }[];
            journals: {
                id: string;
                description: string;
                progress: import("@prisma/client/runtime/library").Decimal;
                status: import("@prisma/client").$Enums.JournalStatus;
                date: Date;
                weather: string | null;
                observations: string | null;
                photos: {
                    id: string;
                    url: string;
                    caption: string | null;
                }[];
            }[];
            attendances: {
                worker: {
                    function: string;
                    name: string;
                };
                id: string;
                status: import("@prisma/client").$Enums.AttendanceStatus;
                date: Date;
                workerId: string;
                hours: import("@prisma/client/runtime/library").Decimal | null;
            }[];
            incidents: {
                id: string;
                createdAt: Date;
                description: string;
                status: import("@prisma/client").$Enums.IncidentStatus;
                title: string;
                severity: import("@prisma/client").$Enums.IncidentSeverity;
            }[];
            export: {
                format: string;
                status: string;
                fileUrl: null;
            };
        };
    }>;
    generate(user: AuthenticatedRequestUser, input: CreateReportDto): Promise<{
        report: {
            companyId: string;
            id: string;
            createdAt: Date;
            userId: string | null;
            chantierId: string;
            type: import("@prisma/client").$Enums.ReportType;
            periodStart: Date;
            periodEnd: Date;
            fileUrl: string | null;
        };
        data: {
            chantier: {
                name: string;
                id: string;
                budget: import("@prisma/client/runtime/library").Decimal;
                progress: import("@prisma/client/runtime/library").Decimal;
                status: import("@prisma/client").$Enums.ChantierStatus;
            };
            expenses: {
                id: string;
                description: string | null;
                category: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                date: Date;
            }[];
            totalValidatedExpenses: import("@prisma/client/runtime/library").Decimal;
            movements: {
                material: {
                    name: string;
                    id: string;
                    unit: string;
                };
                id: string;
                date: Date;
                type: import("@prisma/client").$Enums.MaterialMovementType;
                quantity: import("@prisma/client/runtime/library").Decimal;
                unitCost: import("@prisma/client/runtime/library").Decimal | null;
                reference: string | null;
            }[];
            journals: {
                id: string;
                description: string;
                progress: import("@prisma/client/runtime/library").Decimal;
                status: import("@prisma/client").$Enums.JournalStatus;
                date: Date;
                weather: string | null;
                observations: string | null;
                photos: {
                    id: string;
                    url: string;
                    caption: string | null;
                }[];
            }[];
            attendances: {
                worker: {
                    function: string;
                    name: string;
                };
                id: string;
                status: import("@prisma/client").$Enums.AttendanceStatus;
                date: Date;
                workerId: string;
                hours: import("@prisma/client/runtime/library").Decimal | null;
            }[];
            incidents: {
                id: string;
                createdAt: Date;
                description: string;
                status: import("@prisma/client").$Enums.IncidentStatus;
                title: string;
                severity: import("@prisma/client").$Enums.IncidentSeverity;
            }[];
            export: {
                format: string;
                status: string;
                fileUrl: null;
            };
        };
    }>;
}
