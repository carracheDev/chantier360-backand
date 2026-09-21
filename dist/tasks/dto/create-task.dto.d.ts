import { TaskStatus } from '@prisma/client';
export declare class CreateTaskDto {
    chantierId: string;
    title: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    progress?: number;
    status?: TaskStatus;
}
