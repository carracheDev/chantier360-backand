import { AttendanceStatus } from '@prisma/client';
export declare class CreateAttendanceDto {
    chantierId: string;
    workerId: string;
    date: string;
    status: AttendanceStatus;
    hours?: number;
}
