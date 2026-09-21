import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string) {
    return this.prisma.role.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        _count: { select: { userRoles: true, rolePermissions: true } },
      },
    });
  }

  async create(companyId: string, input: CreateRoleDto) {
    try {
      return await this.prisma.role.create({
        data: {
          companyId,
          name: input.name.trim().toUpperCase(),
          description: input.description?.trim(),
        },
        select: { id: true, name: true, description: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ce rôle existe déjà dans l’entreprise.');
      }
      throw error;
    }
  }
}
