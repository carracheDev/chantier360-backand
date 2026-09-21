import { ReportType } from '@prisma/client';
export declare class CreateReportDto {
    chantierId: string;
    type: ReportType;
    periodStart: string;
    periodEnd: string;
}
