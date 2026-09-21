import { PrismaService } from '../prisma/prisma.service.js';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findCurrent(companyId: string): Promise<{
        name: string;
        id: string;
        phone: string | null;
        createdAt: Date;
        address: string | null;
    }>;
}
