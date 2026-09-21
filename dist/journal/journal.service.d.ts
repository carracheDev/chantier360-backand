import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto.js';
import { CreatePhotoDto } from './dto/create-photo.dto.js';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto.js';
export declare class JournalService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string, userId: string, chantierId?: string): Prisma.PrismaPromise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        progress: Prisma.Decimal;
        status: import("@prisma/client").$Enums.JournalStatus;
        date: Date;
        weather: string | null;
        observations: string | null;
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            caption: string | null;
        }[];
    }[]>;
    findOne(companyId: string, userId: string, journalId: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        progress: Prisma.Decimal;
        status: import("@prisma/client").$Enums.JournalStatus;
        date: Date;
        weather: string | null;
        observations: string | null;
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            caption: string | null;
        }[];
    }>;
    create(companyId: string, userId: string, input: CreateJournalEntryDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        progress: Prisma.Decimal;
        status: import("@prisma/client").$Enums.JournalStatus;
        date: Date;
        weather: string | null;
        observations: string | null;
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            caption: string | null;
        }[];
    }>;
    update(companyId: string, userId: string, journalId: string, input: UpdateJournalEntryDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        progress: Prisma.Decimal;
        status: import("@prisma/client").$Enums.JournalStatus;
        date: Date;
        weather: string | null;
        observations: string | null;
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            caption: string | null;
        }[];
    }>;
    submit(companyId: string, userId: string, journalId: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        progress: Prisma.Decimal;
        status: import("@prisma/client").$Enums.JournalStatus;
        date: Date;
        weather: string | null;
        observations: string | null;
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            caption: string | null;
        }[];
    }>;
    validate(companyId: string, userId: string, journalId: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string;
        chantierId: string;
        progress: Prisma.Decimal;
        status: import("@prisma/client").$Enums.JournalStatus;
        date: Date;
        weather: string | null;
        observations: string | null;
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            caption: string | null;
        }[];
    }>;
    addPhoto(companyId: string, userId: string, journalId: string, input: CreatePhotoDto): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        caption: string | null;
        journalEntryId: string;
    }>;
    findPhotos(companyId: string, userId: string, journalId: string): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        caption: string | null;
        journalEntryId: string;
    }[]>;
    private assertMembership;
    private findAccessibleJournal;
}
