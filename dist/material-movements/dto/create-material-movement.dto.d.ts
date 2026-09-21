import { MaterialMovementType } from '@prisma/client';
export declare class CreateMaterialMovementDto {
    chantierId: string;
    materialId: string;
    type: MaterialMovementType;
    quantity: number;
    unitCost?: number;
    date?: string;
    reference?: string;
}
