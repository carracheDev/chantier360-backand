import { AttendanceStatus, Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttendanceService } from './attendance.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';
const workerId = '44444444-4444-4444-8444-444444444444';

describe('AttendanceService', () => {
  const membershipFindFirst = vi.fn();
  const workerFindFirst = vi.fn();
  const attendanceFindMany = vi.fn();
  const attendanceUpsert = vi.fn();
  let service: AttendanceService;

  beforeEach(() => {
    vi.clearAllMocks();
    membershipFindFirst.mockResolvedValue({ userId });
    workerFindFirst.mockResolvedValue({ id: workerId });
    attendanceUpsert.mockResolvedValue({ id: 'attendance-id' });
    service = new AttendanceService({
      projectMember: { findFirst: membershipFindFirst },
      worker: { findFirst: workerFindFirst },
      attendance: { findMany: attendanceFindMany, upsert: attendanceUpsert },
    } as never);
  });

  it('records or updates one attendance per worker and date', async () => {
    await service.record(companyId, userId, {
      chantierId,
      workerId,
      date: '2026-09-18',
      status: AttendanceStatus.PRESENT,
      hours: 8,
    });

    expect(attendanceUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { workerId_date: { workerId, date: new Date('2026-09-18') } },
      create: expect.objectContaining({ companyId, chantierId, workerId, hours: '8' }),
    }));
  });

  it('rejects a worker not belonging to the requested chantier', async () => {
    workerFindFirst.mockResolvedValue(null);

    await expect(service.record(companyId, userId, {
      chantierId,
      workerId,
      date: '2026-09-18',
      status: AttendanceStatus.PRESENT,
    })).rejects.toBeInstanceOf(NotFoundException);
    expect(attendanceUpsert).not.toHaveBeenCalled();
  });

  it('summarizes attendance and labor cost with Decimal values', async () => {
    attendanceFindMany.mockResolvedValue([
      { status: AttendanceStatus.PRESENT, hours: new Prisma.Decimal(8), worker: { dailyRate: new Prisma.Decimal(12000) } },
      { status: AttendanceStatus.RETARD, hours: new Prisma.Decimal(6), worker: { dailyRate: new Prisma.Decimal(10000) } },
      { status: AttendanceStatus.ABSENT, hours: null, worker: { dailyRate: new Prisma.Decimal(9000) } },
    ]);

    const result = await service.summary(companyId, userId, chantierId);

    expect(result.totalRecords).toBe(3);
    expect(result.present).toBe(1);
    expect(result.late).toBe(1);
    expect(result.absent).toBe(1);
    expect(result.hours.equals(14)).toBe(true);
    expect(result.laborCost.equals(22000)).toBe(true);
  });
});
