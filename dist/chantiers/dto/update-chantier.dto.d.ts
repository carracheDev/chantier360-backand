import { ChantierStatus } from '@prisma/client';
export declare class UpdateChantierDto {
    name?: string;
    description?: string;
    location?: string;
    budget?: number;
    progress?: number;
    startDate?: string;
    endDate?: string;
    status?: ChantierStatus;
}
