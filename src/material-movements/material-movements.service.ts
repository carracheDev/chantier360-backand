import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MaterialMovementType } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto.js';

@Injectable()
export class MaterialMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string, userId: string, chantierId?: string, materialId?: string) {
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

  async getStock(companyId: string, chantierId: string, materialId: string) {
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
    if (!material || !chantier) throw new NotFoundException('Matériau ou chantier introuvable dans l’entreprise.');

    const stock = new Decimal(incoming._sum.quantity ?? 0).minus(outgoing._sum.quantity ?? 0);
    return { ...material, stock, lowStock: stock.lessThan(material.minimumStock) };
  }

  async create(companyId: string, userId: string, input: CreateMaterialMovementDto) {
    return this.prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
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
}
