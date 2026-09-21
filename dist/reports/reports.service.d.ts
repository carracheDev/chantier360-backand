import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReportDto } from './dto/create-report.dto.js';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string, userId: string, chantierId?: string): Prisma.PrismaPromise<{
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
    generate(companyId: string, userId: string, input: CreateReportDto): Promise<{
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
                budget: Prisma.Decimal;
                progress: Prisma.Decimal;
                status: import("@prisma/client").$Enums.ChantierStatus;
            };
            expenses: {
                id: string;
                description: string | null;
                category: string;
                amount: Prisma.Decimal;
                date: Date;
            }[];
            totalValidatedExpenses: Prisma.Decimal;
            movements: {
                material: {
                    name: string;
                    id: string;
                    unit: string;
                };
                id: string;
                date: Date;
                type: import("@prisma/client").$Enums.MaterialMovementType;
                quantity: Prisma.Decimal;
                unitCost: Prisma.Decimal | null;
                reference: string | null;
            }[];
            journals: {
                id: string;
                description: string;
                progress: Prisma.Decimal;
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
                hours: Prisma.Decimal | null;
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
    findOne(companyId: string, userId: string, reportId: string): Promise<{
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
                budget: Prisma.Decimal;
                progress: Prisma.Decimal;
                status: import("@prisma/client").$Enums.ChantierStatus;
            };
            expenses: {
                id: string;
                description: string | null;
                category: string;
                amount: Prisma.Decimal;
                date: Date;
            }[];
            totalValidatedExpenses: Prisma.Decimal;
            movements: {
                material: {
                    name: string;
                    id: string;
                    unit: string;
                };
                id: string;
                date: Date;
                type: import("@prisma/client").$Enums.MaterialMovementType;
                quantity: Prisma.Decimal;
                unitCost: Prisma.Decimal | null;
                reference: string | null;
            }[];
            journals: {
                id: string;
                description: string;
                progress: Prisma.Decimal;
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
                hours: Prisma.Decimal | null;
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
    private buildPeriodData;
    private assertMembership;
}
