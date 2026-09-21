import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { RolesService } from './roles.service.js';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(user: AuthenticatedRequestUser): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        _count: {
            userRoles: number;
            rolePermissions: number;
        };
        description: string | null;
    }[]>;
    create(user: AuthenticatedRequestUser, input: CreateRoleDto): Promise<{
        name: string;
        id: string;
        description: string | null;
    }>;
}
