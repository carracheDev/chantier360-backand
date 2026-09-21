import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  active: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
  userRoles: {
    select: { role: { select: { id: true, name: true, description: true } } },
  },
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string) {
    return this.prisma.user.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
      select: publicUserSelect,
    });
  }

  async create(companyId: string, input: CreateUserDto) {
    const email = input.email.trim().toLowerCase();
    const role = await this.prisma.role.findFirst({ where: { id: input.roleId, companyId } });
    if (!role) throw new NotFoundException('Rôle introuvable dans cette entreprise.');

    try {
      return await this.prisma.user.create({
        data: {
          companyId,
          name: input.name.trim(),
          email,
          phone: input.phone?.trim(),
          passwordHash: await argon2.hash(input.password),
          userRoles: { create: { roleId: role.id } },
        },
        select: publicUserSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Cette adresse email existe déjà dans l’entreprise.');
      }
      throw error;
    }
  }

  async setActive(companyId: string, userId: string, active: boolean) {
    const result = await this.prisma.user.updateMany({
      where: { id: userId, companyId },
      data: { active },
    });
    if (result.count === 0) throw new NotFoundException('Utilisateur introuvable.');

    return this.prisma.user.findFirst({ where: { id: userId, companyId }, select: publicUserSelect });
  }
}
