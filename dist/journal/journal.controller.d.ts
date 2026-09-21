import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto.js';
import { CreatePhotoDto } from './dto/create-photo.dto.js';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto.js';
import { JournalService } from './journal.service.js';
export declare class JournalController {
    private readonly journalService;
    constructor(journalService: JournalService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
        progress: import("@prisma/client/runtime/library").Decimal;
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
    findOne(user: AuthenticatedRequestUser, journalId: string): Promise<{
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
        progress: import("@prisma/client/runtime/library").Decimal;
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
    findPhotos(user: AuthenticatedRequestUser, journalId: string): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        caption: string | null;
        journalEntryId: string;
    }[]>;
    create(user: AuthenticatedRequestUser, input: CreateJournalEntryDto): Promise<{
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
        progress: import("@prisma/client/runtime/library").Decimal;
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
    update(user: AuthenticatedRequestUser, journalId: string, input: UpdateJournalEntryDto): Promise<{
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
        progress: import("@prisma/client/runtime/library").Decimal;
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
    submit(user: AuthenticatedRequestUser, journalId: string): Promise<{
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
        progress: import("@prisma/client/runtime/library").Decimal;
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
    validate(user: AuthenticatedRequestUser, journalId: string): Promise<{
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
        progress: import("@prisma/client/runtime/library").Decimal;
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
    addPhoto(user: AuthenticatedRequestUser, journalId: string, input: CreatePhotoDto): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        caption: string | null;
        journalEntryId: string;
    }>;
}
