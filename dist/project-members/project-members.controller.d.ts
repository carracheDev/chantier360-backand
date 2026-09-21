import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { AssignProjectMemberDto } from './dto/assign-project-member.dto.js';
import { ProjectMembersService } from './project-members.service.js';
export declare class ProjectMembersController {
    private readonly projectMembersService;
    constructor(projectMembersService: ProjectMembersService);
    findAll(user: AuthenticatedRequestUser): import("@prisma/client").Prisma.PrismaPromise<{
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
    findCandidates(user: AuthenticatedRequestUser): Promise<{
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
    assign(user: AuthenticatedRequestUser, input: AssignProjectMemberDto): Promise<{
        userId: string;
        chantierId: string;
        assignedAt: Date;
    }>;
    remove(user: AuthenticatedRequestUser, userId: string, chantierId: string): Promise<{
        removed: boolean;
    }>;
}
