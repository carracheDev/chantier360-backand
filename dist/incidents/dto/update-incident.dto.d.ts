import { IncidentSeverity, IncidentStatus } from '@prisma/client';
export declare class UpdateIncidentDto {
    title?: string;
    description?: string;
    severity?: IncidentSeverity;
    status?: IncidentStatus;
}
