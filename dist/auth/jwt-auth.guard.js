var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { jwtVerify } from 'jose';
let JwtAuthGuard = class JwtAuthGuard {
    async canActivate(context) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET est obligatoire pour vérifier les tokens.');
        }
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const [scheme, token] = authorization?.split(' ') ?? [];
        if (scheme?.toLowerCase() !== 'bearer' || !token) {
            throw new UnauthorizedException('Token Bearer requis.');
        }
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
                algorithms: ['HS256'],
            });
            if (typeof payload.sub !== 'string' || typeof payload.companyId !== 'string' || typeof payload.email !== 'string') {
                throw new UnauthorizedException('Token invalide.');
            }
            request.user = {
                id: payload.sub,
                sub: payload.sub,
                companyId: payload.companyId,
                email: payload.email,
            };
            return true;
        }
        catch {
            throw new UnauthorizedException('Token invalide ou expiré.');
        }
    }
};
JwtAuthGuard = __decorate([
    Injectable()
], JwtAuthGuard);
export { JwtAuthGuard };
//# sourceMappingURL=jwt-auth.guard.js.map