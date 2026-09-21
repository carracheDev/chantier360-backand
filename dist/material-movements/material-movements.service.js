var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MaterialMovementType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service.js';
let MaterialMovementsService = class MaterialMovementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId, userId, chantierId, materialId) {
        return this.prisma.materialMovement.findMany({
            where: {
                companyId,
                chantierId,
                materialId,
                chantier: { projectMembers: { some: { companyId, userId } } },
            },
            orderBy: { date: 'desc' },
            select: {
                id: true,
                chantierId: true,
                materialId: true,
                userId: true,
                type: true,
                quantity: true,
                unitCost: true,
                date: true,
                reference: true,
                createdAt: true,
                material: { select: { name: true, unit: true } },
            },
        });
    }
    async getStock(companyId, chantierId, materialId) {
        const [material, chantier, incoming, outgoing] = await Promise.all([
            this.prisma.material.findFirst({ where: { id: materialId, companyId }, select: { id: true, name: true, unit: true, minimumStock: true } }),
            this.prisma.chantier.findFirst({ where: { id: chantierId, companyId }, select: { id: true } }),
            this.prisma.materialMovement.aggregate({
                where: { companyId, chantierId, materialId, type: MaterialMovementType.ENTREE },
                _sum: { quantity: true },
            }),
            this.prisma.materialMovement.aggregate({
                where: { companyId, chantierId, materialId, type: MaterialMovementType.SORTIE },
                _sum: { quantity: true },
            }),
        ]);
        if (!material || !chantier)
            throw new NotFoundException('Matériau ou chantier introuvable dans l’entreprise.');
        const stock = new Decimal(incoming._sum.quantity ?? 0).minus(outgoing._sum.quantity ?? 0);
        return { ...material, stock, lowStock: stock.lessThan(material.minimumStock) };
    }
    async create(companyId, userId, input) {
        return this.prisma.$transaction(async (transaction) => {
            const [material, chantier, membership] = await Promise.all([
                transaction.material.findFirst({ where: { id: input.materialId, companyId }, select: { id: true } }),
                transaction.chantier.findFirst({ where: { id: input.chantierId, companyId }, select: { id: true } }),
                transaction.projectMember.findFirst({ where: { userId, companyId, chantierId: input.chantierId }, select: { userId: true } }),
            ]);
            if (!material || !chantier || !membership) {
                throw new NotFoundException('Matériau, chantier ou affectation introuvable.');
            }
            if (input.type === MaterialMovementType.SORTIE) {
                const [incoming, outgoing] = await Promise.all([
                    transaction.materialMovement.aggregate({ where: { companyId, chantierId: input.chantierId, materialId: input.materialId, type: MaterialMovementType.ENTREE }, _sum: { quantity: true } }),
                    transaction.materialMovement.aggregate({ where: { companyId, chantierId: input.chantierId, materialId: input.materialId, type: MaterialMovementType.SORTIE }, _sum: { quantity: true } }),
                ]);
                const available = new Decimal(incoming._sum.quantity ?? 0).minus(outgoing._sum.quantity ?? 0);
                if (new Decimal(input.quantity).greaterThan(available)) {
                    throw new BadRequestException('Stock insuffisant pour cette sortie.');
                }
            }
            return transaction.materialMovement.create({
                data: {
                    companyId,
                    chantierId: input.chantierId,
                    materialId: input.materialId,
                    userId,
                    type: input.type,
                    quantity: input.quantity.toString(),
                    unitCost: input.unitCost?.toString(),
                    date: input.date ? new Date(input.date) : undefined,
                    reference: input.reference?.trim(),
                },
                select: { id: true, chantierId: true, materialId: true, type: true, quantity: true, unitCost: true, date: true, reference: true },
            });
        });
    }
};
MaterialMovementsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], MaterialMovementsService);
export { MaterialMovementsService };
//# sourceMappingURL=material-movements.service.js.map