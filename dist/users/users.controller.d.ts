import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UsersService } from './users.service.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(user: AuthenticatedRequestUser): import("@prisma/client").Prisma.PrismaPromise<{
        companyId: string;
        email: string;
        name: string;
        id: string;
        phone: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        userRoles: {
            role: {
                name: string;
                id: string;
                description: string | null;
            };
        }[];
    }[]>;
    create(user: AuthenticatedRequestUser, input: CreateUserDto): Promise<{
        companyId: string;
        email: string;
        name: string;
        id: string;
        phone: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        userRoles: {
            role: {
                name: string;
                id: string;
                description: string | null;
            };
        }[];
    }>;
    setActive(user: AuthenticatedRequestUser, userId: string, input: UpdateUserStatusDto): Promise<{
        companyId: string;
        email: string;
        name: string;
        id: string;
        phone: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        userRoles: {
            role: {
                name: string;
                id: string;
                description: string | null;
            };
        }[];
    } | null>;
}
