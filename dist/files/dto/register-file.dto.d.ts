import { FileAssetKind } from '@prisma/client';
export declare class RegisterFileDto {
    kind: FileAssetKind;
    storageKey: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    chantierId?: string;
    targetType?: string;
    targetId?: string;
}
