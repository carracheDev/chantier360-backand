import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string, userId: string, chantierId?: string): Prisma.PrismaPromise<{
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        chantierId: string;
        progress: Prisma.Decimal;
        startDate: Date | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
    }[]>;
    findOverdue(companyId: string, userId: string): Prisma.PrismaPromise<{
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        chantierId: string;
        progress: Prisma.Decimal;
        startDate: Date | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
    }[]>;
    create(companyId: string, userId: string, input: CreateTaskDto): Promise<{
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        chantierId: string;
        progress: Prisma.Decimal;
        startDate: Date | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
    }>;
    update(companyId: string, userId: string, taskId: string, input: UpdateTaskDto): Promise<{
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        chantierId: string;
        progress: Prisma.Decimal;
        startDate: Date | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
    }>;
    private assertMembership;
    private findAccessible;
    private validateDates;
}
