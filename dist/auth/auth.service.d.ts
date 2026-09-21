import type { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthenticatedRequestUser } from './auth.types.js';
import { LoginDto } from './dto/login.dto.js';
export type AuthenticatedUser = Pick<User, 'id' | 'companyId' | 'name' | 'email'>;
export type AuthenticatedUserProfile = AuthenticatedUser & {
    phone: string | null;
    active: boolean;
    roles: {
        id: string;
        name: string;
        description: string | null;
    }[];
    permissions: string[];
};
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    login(input: LoginDto): Promise<{
        accessToken: string;
        user: AuthenticatedUser;
    }>;
    findProfile(user: AuthenticatedRequestUser): Promise<AuthenticatedUserProfile>;
}
