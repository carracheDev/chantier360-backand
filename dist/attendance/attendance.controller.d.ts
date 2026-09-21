import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { AttendanceService } from './attendance.service.js';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string): import("@prisma/client").Prisma.PrismaPromise<{
        worker: {
            function: string;
            name: string;
            dailyRate: import("@prisma/client/runtime/library").Decimal | null;
        };
        companyId: string;
        id: string;
        createdAt: Date;
        chantierId: string;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        date: Date;
        workerId: string;
        hours: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    summary(user: AuthenticatedRequestUser, chantierId: string, from?: string, to?: string): Promise<{
        totalRecords: number;
        present: number;
        absent: number;
        late: number;
        hours: import("@prisma/client/runtime/library").Decimal;
        laborCost: import("@prisma/client/runtime/library").Decimal;
    }>;
    record(user: AuthenticatedRequestUser, input: CreateAttendanceDto): Promise<{
        id: string;
        chantierId: string;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        date: Date;
        workerId: string;
        hours: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
