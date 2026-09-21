import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { UpdateIncidentDto } from './dto/update-incident.dto.js';
import { IncidentsService } from './incidents.service.js';
export declare class IncidentsController {
    private readonly incidentsService;
    constructor(incidentsService: IncidentsService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string): import("@prisma/client").Prisma.PrismaPromise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        status: import("@prisma/client").$Enums.IncidentStatus;
        title: string;
        severity: import("@prisma/client").$Enums.IncidentSeverity;
    }[]>;
    create(user: AuthenticatedRequestUser, input: CreateIncidentDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        status: import("@prisma/client").$Enums.IncidentStatus;
        title: string;
        severity: import("@prisma/client").$Enums.IncidentSeverity;
    }>;
    update(user: AuthenticatedRequestUser, incidentId: string, input: UpdateIncidentDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        status: import("@prisma/client").$Enums.IncidentStatus;
        title: string;
        severity: import("@prisma/client").$Enums.IncidentSeverity;
    }>;
}
