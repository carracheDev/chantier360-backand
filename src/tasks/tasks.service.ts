import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

const taskSelect = {
  id: true,
  companyId: true,
  chantierId: true,
  title: true,
  description: true,
  startDate: true,
  dueDate: true,
  progress: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TaskSelect;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string, userId: string, chantierId?: string) {
    return this.prisma.task.findMany({
      where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      select: taskSelect,
    });
  }

  findOverdue(companyId: string, userId: string) {
    return this.prisma.task.findMany({
      where: {
        companyId,
        dueDate: { lt: new Date() },
        status: { not: TaskStatus.TERMINE },
        chantier: { projectMembers: { some: { companyId, userId } } },
      },
      orderBy: { dueDate: 'asc' },
      select: taskSelect,
    });
  }

  async create(companyId: string, userId: string, input: CreateTaskDto) {
    await this.assertMembership(companyId, userId, input.chantierId);
    this.validateDates(input.startDate, input.dueDate);
    return this.prisma.task.create({
      data: {
        companyId,
        chantierId: input.chantierId,
        title: input.title.trim(),
        description: input.description?.trim(),
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        progress: (input.progress ?? 0).toString(),
        status: input.status,
      },
      select: taskSelect,
    });
  }

  async update(companyId: string, userId: string, taskId: string, input: UpdateTaskDto) {
    await this.findAccessible(companyId, userId, taskId);
    this.validateDates(input.startDate, input.dueDate);
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: input.title?.trim(),
        description: input.description?.trim(),
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        progress: input.progress === undefined ? undefined : input.progress.toString(),
        status: input.status,
      },
      select: taskSelect,
    });
  }

  private async assertMembership(companyId: string, userId: string, chantierId: string) {
    const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
    if (!membership) throw new NotFoundException('Chantier ou affectation introuvable.');
  }

  private async findAccessible(companyId: string, userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, companyId, chantier: { companyId, projectMembers: { some: { companyId, userId } } } },
      select: { id: true },
    });
    if (!task) throw new NotFoundException('Tâche introuvable ou inaccessible.');
    return task;
  }

  private validateDates(startDate?: string, dueDate?: string) {
    if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      throw new BadRequestException('La date d’échéance doit être postérieure à la date de début.');
    }
  }
}
