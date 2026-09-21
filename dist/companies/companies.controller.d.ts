import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CompaniesService } from './companies.service.js';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findCurrent(user: AuthenticatedRequestUser): Promise<{
        name: string;
        id: string;
        phone: string | null;
        createdAt: Date;
        address: string | null;
    }>;
}
