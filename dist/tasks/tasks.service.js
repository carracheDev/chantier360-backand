var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
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
};
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId, userId, chantierId) {
        return this.prisma.task.findMany({
            where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
            orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
            select: taskSelect,
        });
    }
    findOverdue(companyId, userId) {
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
    async create(companyId, userId, input) {
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
    async update(companyId, userId, taskId, input) {
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
    async assertMembership(companyId, userId, chantierId) {
        const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
        if (!membership)
            throw new NotFoundException('Chantier ou affectation introuvable.');
    }
    async findAccessible(companyId, userId, taskId) {
        const task = await this.prisma.task.findFirst({
            where: { id: taskId, companyId, chantier: { companyId, projectMembers: { some: { companyId, userId } } } },
            select: { id: true },
        });
        if (!task)
            throw new NotFoundException('Tâche introuvable ou inaccessible.');
        return task;
    }
    validateDates(startDate, dueDate) {
        if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
            throw new BadRequestException('La date d’échéance doit être postérieure à la date de début.');
        }
    }
};
TasksService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TasksService);
export { TasksService };
//# sourceMappingURL=tasks.service.js.map