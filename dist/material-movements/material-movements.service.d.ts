import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto.js';
export declare class MaterialMovementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string, userId: string, chantierId?: string, materialId?: string): Prisma.PrismaPromise<{
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
        quantity: Prisma.Decimal;
        unitCost: Prisma.Decimal | null;
        reference: string | null;
    }[]>;
    getStock(companyId: string, chantierId: string, materialId: string): Promise<{
        stock: Prisma.Decimal;
        lowStock: boolean;
        name: string;
        id: string;
        unit: string;
        minimumStock: Prisma.Decimal;
    }>;
    create(companyId: string, userId: string, input: CreateMaterialMovementDto): Promise<{
        id: string;
        chantierId: string;
        date: Date;
        materialId: string;
        type: import("@prisma/client").$Enums.MaterialMovementType;
        quantity: Prisma.Decimal;
        unitCost: Prisma.Decimal | null;
        reference: string | null;
    }>;
}
