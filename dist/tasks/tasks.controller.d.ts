import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string): import("@prisma/client").Prisma.PrismaPromise<{
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        chantierId: string;
        progress: import("@prisma/client/runtime/library").Decimal;
        startDate: Date | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
    }[]>;
    findOverdue(user: AuthenticatedRequestUser): import("@prisma/client").Prisma.PrismaPromise<{
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        chantierId: string;
        progress: import("@prisma/client/runtime/library").Decimal;
        startDate: Date | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
    }[]>;
    create(user: AuthenticatedRequestUser, input: CreateTaskDto): Promise<{
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        chantierId: string;
        progress: import("@prisma/client/runtime/library").Decimal;
        startDate: Date | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
    }>;
    update(user: AuthenticatedRequestUser, taskId: string, input: UpdateTaskDto): Promise<{
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        chantierId: string;
        progress: import("@prisma/client/runtime/library").Decimal;
        startDate: Date | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
    }>;
}
