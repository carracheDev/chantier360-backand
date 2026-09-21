var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let ChantierAccessGuard = class ChantierAccessGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const chantierId = request.params.chantierId ?? request.params.id ?? request.body?.chantierId;
        if (!user)
            throw new UnauthorizedException('Utilisateur authentifié requis.');
        if (!chantierId)
            throw new ForbiddenException('Identifiant chantier requis.');
        const membership = await this.prisma.projectMember.findFirst({
            where: {
                userId: user.id,
                companyId: user.companyId,
                chantierId,
                chantier: { companyId: user.companyId },
            },
            select: { userId: true },
        });
        if (!membership) {
            throw new ForbiddenException('Accès à ce chantier non autorisé.');
        }
        return true;
    }
};
ChantierAccessGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ChantierAccessGuard);
export { ChantierAccessGuard };
//# sourceMappingURL=chantier-access.guard.js.map