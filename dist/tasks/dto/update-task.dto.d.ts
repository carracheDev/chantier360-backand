import { TaskStatus } from '@prisma/client';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    progress?: number;
    status?: TaskStatus;
}
