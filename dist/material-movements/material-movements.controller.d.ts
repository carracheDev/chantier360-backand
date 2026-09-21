import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto.js';
import { MaterialMovementsService } from './material-movements.service.js';
export declare class MaterialMovementsController {
    private readonly movementsService;
    constructor(movementsService: MaterialMovementsService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string, materialId?: string): import("@prisma/client").Prisma.PrismaPromise<{
        material: {
            name: string;
            unit: string;
        };
        id: string;
        createdAt: Date;
        userId: string | null;
        chantierId: string;
        date: Date;
        materialId: string;
        type: import("@prisma/client").$Enums.MaterialMovementType;
        quantity: import("@prisma/client/runtime/library").Decimal;
        unitCost: import("@prisma/client/runtime/library").Decimal | null;
        reference: string | null;
    }[]>;
    getStock(user: AuthenticatedRequestUser, chantierId: string, materialId: string): Promise<{
        stock: import("@prisma/client/runtime/library").Decimal;
        lowStock: boolean;
        name: string;
        id: string;
        unit: string;
        minimumStock: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(user: AuthenticatedRequestUser, input: CreateMaterialMovementDto): Promise<{
        id: string;
        chantierId: string;
        date: Date;
        materialId: string;
        type: import("@prisma/client").$Enums.MaterialMovementType;
        quantity: import("@prisma/client/runtime/library").Decimal;
        unitCost: import("@prisma/client/runtime/library").Decimal | null;
        reference: string | null;
    }>;
}
