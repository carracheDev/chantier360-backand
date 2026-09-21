import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AssignProjectMemberDto } from './dto/assign-project-member.dto.js';

@Injectable()
export class ProjectMembersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string) {
    return this.prisma.projectMember.findMany({
      where: { companyId },
      orderBy: { assignedAt: 'desc' },
      select: {
        userId: true,
        chantierId: true,
        assignedAt: true,
        user: { select: { id: true, name: true, email: true, active: true } },
        chantier: { select: { id: true, name: true, status: true } },
      },
    });
  }

  async assign(companyId: string, input: AssignProjectMemberDto) {
    const [user, chantier] = await Promise.all([
      this.prisma.user.findFirst({ where: { id: input.userId, companyId, active: true }, select: { id: true } }),
      this.prisma.chantier.findFirst({ where: { id: input.chantierId, companyId }, select: { id: true } }),
    ]);
    if (!user || !chantier) throw new NotFoundException('Utilisateur ou chantier introuvable dans l’entreprise.');

    return this.prisma.projectMember.upsert({
      where: { userId_chantierId: { userId: input.userId, chantierId: input.chantierId } },
      update: {},
      create: { companyId, userId: input.userId, chantierId: input.chantierId },
      select: { userId: true, chantierId: true, assignedAt: true },
    });
  }

  async remove(companyId: string, userId: string, chantierId: string) {
    const result = await this.prisma.projectMember.deleteMany({ where: { companyId, userId, chantierId } });
    if (result.count === 0) throw new NotFoundException('Affectation introuvable.');
    return { removed: true };
  }
}
