import { PrismaService } from '../prisma/prisma.service.js';
import { AssignProjectMemberDto } from './dto/assign-project-member.dto.js';
export declare class ProjectMembersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string): import("@prisma/client").Prisma.PrismaPromise<{
        user: {
            email: string;
            name: string;
            id: string;
            active: boolean;
        };
        chantier: {
            name: string;
            id: string;
            status: import("@prisma/client").$Enums.ChantierStatus;
        };
        userId: string;
        chantierId: string;
        assignedAt: Date;
    }[]>;
    findCandidates(companyId: string): Promise<{
        users: {
            id: string;
            name: string;
            email: string;
            roles: {
                name: string;
                id: string;
            }[];
        }[];
        chantiers: {
            name: string;
            id: string;
            status: import("@prisma/client").$Enums.ChantierStatus;
        }[];
    }>;
    assign(companyId: string, input: AssignProjectMemberDto): Promise<{
        userId: string;
        chantierId: string;
        assignedAt: Date;
    }>;
    remove(companyId: string, userId: string, chantierId: string): Promise<{
        removed: boolean;
    }>;
}
