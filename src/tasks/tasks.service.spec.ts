import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TasksService } from './tasks.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';
const taskId = '44444444-4444-4444-8444-444444444444';

describe('TasksService', () => {
  const membershipFindFirst = vi.fn();
  const taskFindMany = vi.fn();
  const taskFindFirst = vi.fn();
  const taskCreate = vi.fn();
  const taskUpdate = vi.fn();
  let service: TasksService;

  beforeEach(() => {
    vi.clearAllMocks();
    membershipFindFirst.mockResolvedValue({ userId });
    taskFindFirst.mockResolvedValue({ id: taskId });
    taskCreate.mockResolvedValue({ id: taskId });
    taskUpdate.mockResolvedValue({ id: taskId });
    service = new TasksService({
      projectMember: { findFirst: membershipFindFirst },
      task: { findMany: taskFindMany, findFirst: taskFindFirst, create: taskCreate, update: taskUpdate },
    } as never);
  });

  it('creates a task with bounded progress and dates', async () => {
    await service.create(companyId, userId, {
      chantierId,
      title: 'Terminer la dalle',
      startDate: '2026-09-18',
      dueDate: '2026-09-25',
      progress: 70,
      status: TaskStatus.EN_COURS,
    });

    expect(taskCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ companyId, chantierId, progress: '70', status: TaskStatus.EN_COURS }),
    }));
  });

  it('rejects a due date before the start date', async () => {
    await expect(service.create(companyId, userId, {
      chantierId,
      title: 'Tâche invalide',
      startDate: '2026-09-25',
      dueDate: '2026-09-18',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(taskCreate).not.toHaveBeenCalled();
  });

  it('lists overdue non-completed tasks for assigned chantiers', async () => {
    taskFindMany.mockResolvedValue([]);

    await service.findOverdue(companyId, userId);

    expect(taskFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ companyId, status: { not: TaskStatus.TERMINE } }),
    }));
  });

  it('rejects updates outside the assigned company chantier', async () => {
    taskFindFirst.mockResolvedValue(null);

    await expect(service.update(companyId, userId, taskId, { progress: 20 }))
      .rejects.toBeInstanceOf(NotFoundException);
    expect(taskUpdate).not.toHaveBeenCalled();
  });
});
