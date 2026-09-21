import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { UpdateIncidentDto } from './dto/update-incident.dto.js';
export declare class IncidentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string, userId: string, chantierId?: string): Prisma.PrismaPromise<{
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
    create(companyId: string, userId: string, input: CreateIncidentDto): Promise<{
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
    update(companyId: string, userId: string, incidentId: string, input: UpdateIncidentDto): Promise<{
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
    private assertMembership;
    private findAccessible;
}
