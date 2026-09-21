import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string): Prisma.PrismaPromise<{
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
    create(companyId: string, input: CreateUserDto): Promise<{
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
    setActive(companyId: string, userId: string, active: boolean): Promise<{
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
