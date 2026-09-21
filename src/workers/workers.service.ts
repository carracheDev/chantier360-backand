import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWorkerDto } from './dto/create-worker.dto.js';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string, userId: string, chantierId?: string) {
    return this.prisma.worker.findMany({
      where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
      orderBy: { name: 'asc' },
      select: { id: true, companyId: true, chantierId: true, name: true, function: true, phone: true, dailyRate: true, createdAt: true, updatedAt: true },
    });
  }

  async create(companyId: string, userId: string, input: CreateWorkerDto) {
    await this.assertMembership(companyId, userId, input.chantierId);
    try {
      return await this.prisma.worker.create({
        data: {
          companyId,
          chantierId: input.chantierId,
          name: input.name.trim(),
          function: input.function.trim(),
          phone: input.phone?.trim(),
          dailyRate: input.dailyRate?.toString(),
        },
        select: { id: true, companyId: true, chantierId: true, name: true, function: true, phone: true, dailyRate: true, createdAt: true, updatedAt: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ce travailleur est déjà enregistré.');
      }
      throw error;
    }
  }

  private async assertMembership(companyId: string, userId: string, chantierId: string) {
    const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
    if (!membership) throw new NotFoundException('Chantier ou affectation introuvable.');
  }
}
