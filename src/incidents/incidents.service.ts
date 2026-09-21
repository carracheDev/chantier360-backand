import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { UpdateIncidentDto } from './dto/update-incident.dto.js';

const incidentSelect = {
  id: true,
  companyId: true,
  chantierId: true,
  userId: true,
  title: true,
  description: true,
  severity: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.IncidentSelect;

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string, userId: string, chantierId?: string) {
    return this.prisma.incident.findMany({
      where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
      orderBy: { createdAt: 'desc' },
      select: incidentSelect,
    });
  }

  async create(companyId: string, userId: string, input: CreateIncidentDto) {
    await this.assertMembership(companyId, userId, input.chantierId);
    return this.prisma.incident.create({
      data: {
        companyId,
        chantierId: input.chantierId,
        userId,
        title: input.title.trim(),
        description: input.description.trim(),
        severity: input.severity,
      },
      select: incidentSelect,
    });
  }

  async update(companyId: string, userId: string, incidentId: string, input: UpdateIncidentDto) {
    await this.findAccessible(companyId, userId, incidentId);
    return this.prisma.incident.update({
      where: { id: incidentId },
      data: {
        title: input.title?.trim(),
        description: input.description?.trim(),
        severity: input.severity,
        status: input.status,
      },
      select: incidentSelect,
    });
  }

  private async assertMembership(companyId: string, userId: string, chantierId: string) {
    const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
    if (!membership) throw new NotFoundException('Chantier ou affectation introuvable.');
  }

  private async findAccessible(companyId: string, userId: string, incidentId: string) {
    const incident = await this.prisma.incident.findFirst({
      where: { id: incidentId, companyId, chantier: { companyId, projectMembers: { some: { companyId, userId } } } },
      select: { id: true },
    });
    if (!incident) throw new NotFoundException('Incident introuvable ou inaccessible.');
    return incident;
  }
}
