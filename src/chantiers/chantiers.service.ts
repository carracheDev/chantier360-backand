import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateChantierDto } from './dto/create-chantier.dto.js';
import { UpdateChantierDto } from './dto/update-chantier.dto.js';

const chantierSelect = {
  id: true,
  companyId: true,
  name: true,
  description: true,
  location: true,
  budget: true,
  progress: true,
  startDate: true,
  endDate: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { projectMembers: true, expenses: true, workers: true, incidents: true } },
} satisfies Prisma.ChantierSelect;

@Injectable()
export class ChantiersService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForUser(companyId: string, userId: string) {
    return this.prisma.chantier.findMany({
      where: { companyId, projectMembers: { some: { userId, companyId } } },
      orderBy: { createdAt: 'desc' },
      select: chantierSelect,
    });
  }

  async findOne(companyId: string, chantierId: string) {
    const chantier = await this.prisma.chantier.findFirst({
      where: { id: chantierId, companyId },
      select: chantierSelect,
    });
    if (!chantier) throw new NotFoundException('Chantier introuvable.');
    return chantier;
  }

  async create(companyId: string, userId: string, input: CreateChantierDto) {
    this.validateDates(input.startDate, input.endDate);

    return this.prisma.$transaction(async (transaction) => {
      const chantier = await transaction.chantier.create({
        data: {
          companyId,
          name: input.name.trim(),
          description: input.description?.trim(),
          location: input.location?.trim(),
          budget: input.budget.toString(),
          progress: (input.progress ?? 0).toString(),
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          status: input.status,
        },
        select: chantierSelect,
      });
      await transaction.projectMember.create({
        data: { companyId, userId, chantierId: chantier.id },
      });
      return chantier;
    });
  }

  async update(companyId: string, chantierId: string, input: UpdateChantierDto) {
    const current = await this.prisma.chantier.findFirst({
      where: { id: chantierId, companyId },
      select: { startDate: true, endDate: true },
    });
    if (!current) throw new NotFoundException('Chantier introuvable.');

    const startDate = input.startDate ?? current.startDate.toISOString();
    const endDate = input.endDate ?? current.endDate?.toISOString();
    this.validateDates(startDate, endDate);

    return this.prisma.chantier.update({
      where: { id: chantierId },
      data: {
        name: input.name?.trim(),
        description: input.description?.trim(),
        location: input.location?.trim(),
        budget: input.budget === undefined ? undefined : input.budget.toString(),
        progress: input.progress === undefined ? undefined : input.progress.toString(),
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        status: input.status,
      },
      select: chantierSelect,
    });
  }

  private validateDates(startDate: string, endDate?: string): void {
    if (endDate && new Date(endDate) < new Date(startDate)) {
      throw new BadRequestException('La date de fin doit être postérieure à la date de début.');
    }
  }
}
