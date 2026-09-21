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

  /**
   * Candidats à une affectation : utilisateurs actifs et chantiers de l'entreprise.
   *
   * `GET /chantiers` reste volontairement limité aux chantiers dont l'appelant est membre :
   * un administrateur qui gère les affectations doit donc disposer d'une vue société complète,
   * sans pour autant obtenir la lecture métier des chantiers (permission chantier.read).
   */
  async findCandidates(companyId: string) {
    const [users, chantiers] = await Promise.all([
      this.prisma.user.findMany({
        where: { companyId, active: true },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          userRoles: { select: { role: { select: { id: true, name: true } } } },
        },
      }),
      this.prisma.chantier.findMany({
        where: { companyId },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, status: true },
      }),
    ]);

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.userRoles.map((userRole) => userRole.role),
      })),
      chantiers,
    };
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
