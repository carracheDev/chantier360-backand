import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
export declare class RolesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string): Prisma.PrismaPromise<{
        name: string;
        id: string;
        _count: {
            userRoles: number;
            rolePermissions: number;
        };
        description: string | null;
    }[]>;
    create(companyId: string, input: CreateRoleDto): Promise<{
        name: string;
        id: string;
        description: string | null;
    }>;
}
