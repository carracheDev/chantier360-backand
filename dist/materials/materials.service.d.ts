import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
export declare class MaterialsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string): Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        minimumStock: Prisma.Decimal;
    }[]>;
    create(companyId: string, input: CreateMaterialDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        minimumStock: Prisma.Decimal;
    }>;
}
