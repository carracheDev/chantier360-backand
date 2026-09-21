import { IncidentSeverity } from '@prisma/client';
export declare class CreateIncidentDto {
    chantierId: string;
    title: string;
    description: string;
    severity: IncidentSeverity;
}
