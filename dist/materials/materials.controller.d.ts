import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
import { MaterialsService } from './materials.service.js';
export declare class MaterialsController {
    private readonly materialsService;
    constructor(materialsService: MaterialsService);
    findAll(user: AuthenticatedRequestUser): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        minimumStock: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    create(user: AuthenticatedRequestUser, input: CreateMaterialDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        minimumStock: import("@prisma/client/runtime/library").Decimal;
    }>;
}
