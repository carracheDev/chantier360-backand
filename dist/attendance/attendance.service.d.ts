import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
export declare class AttendanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string, userId: string, chantierId?: string): Prisma.PrismaPromise<{
        worker: {
            function: string;
            name: string;
            dailyRate: Prisma.Decimal | null;
        };
        companyId: string;
        id: string;
        createdAt: Date;
        chantierId: string;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        date: Date;
        workerId: string;
        hours: Prisma.Decimal | null;
    }[]>;
    record(companyId: string, userId: string, input: CreateAttendanceDto): Promise<{
        id: string;
        chantierId: string;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        date: Date;
        workerId: string;
        hours: Prisma.Decimal | null;
    }>;
    summary(companyId: string, userId: string, chantierId: string, from?: string, to?: string): Promise<{
        totalRecords: number;
        present: number;
        absent: number;
        late: number;
        hours: Prisma.Decimal;
        laborCost: Prisma.Decimal;
    }>;
}
