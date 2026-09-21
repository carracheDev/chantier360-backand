import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string) {
    return this.prisma.material.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, unit: true, minimumStock: true, createdAt: true, updatedAt: true },
    });
  }

  async create(companyId: string, input: CreateMaterialDto) {
    try {
      return await this.prisma.material.create({
        data: {
          companyId,
          name: input.name.trim(),
          unit: input.unit.trim(),
          minimumStock: input.minimumStock.toString(),
        },
        select: { id: true, name: true, unit: true, minimumStock: true, createdAt: true, updatedAt: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ce matériau existe déjà dans l’entreprise.');
      }
      throw error;
    }
  }
}
