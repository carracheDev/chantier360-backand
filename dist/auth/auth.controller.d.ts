import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import type { AuthenticatedRequestUser } from './auth.types.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(input: LoginDto): Promise<{
        accessToken: string;
        user: import("./auth.service.js").AuthenticatedUser;
    }>;
    me(user: AuthenticatedRequestUser): Promise<{
        user: AuthenticatedRequestUser;
        profile: import("./auth.service.js").AuthenticatedUserProfile;
    }>;
}
