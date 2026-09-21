var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(companyId, userId, chantierId) {
        return this.prisma.attendance.findMany({
            where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
            orderBy: { date: 'desc' },
            select: {
                id: true,
                companyId: true,
                chantierId: true,
                workerId: true,
                date: true,
                status: true,
                hours: true,
                createdAt: true,
                worker: { select: { name: true, function: true, dailyRate: true } },
            },
        });
    }
    async record(companyId, userId, input) {
        const [worker, membership] = await Promise.all([
            this.prisma.worker.findFirst({ where: { id: input.workerId, companyId, chantierId: input.chantierId }, select: { id: true } }),
            this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId: input.chantierId }, select: { userId: true } }),
        ]);
        if (!worker || !membership)
            throw new NotFoundException('Travailleur, chantier ou affectation introuvable.');
        return this.prisma.attendance.upsert({
            where: { workerId_date: { workerId: input.workerId, date: new Date(input.date) } },
            update: { status: input.status, hours: input.hours?.toString() },
            create: {
                companyId,
                chantierId: input.chantierId,
                workerId: input.workerId,
                date: new Date(input.date),
                status: input.status,
                hours: input.hours?.toString(),
            },
            select: { id: true, chantierId: true, workerId: true, date: true, status: true, hours: true },
        });
    }
    async summary(companyId, userId, chantierId, from, to) {
        const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
        if (!membership)
            throw new NotFoundException('Chantier ou affectation introuvable.');
        const attendances = await this.prisma.attendance.findMany({
            where: {
                companyId,
                chantierId,
                date: {
                    gte: from ? new Date(from) : undefined,
                    lte: to ? new Date(to) : undefined,
                },
            },
            select: { status: true, hours: true, worker: { select: { dailyRate: true } } },
        });
        let hours = new Prisma.Decimal(0);
        let laborCost = new Prisma.Decimal(0);
        let present = 0;
        let absent = 0;
        let late = 0;
        for (const attendance of attendances) {
            hours = hours.plus(attendance.hours ?? 0);
            if (attendance.status === AttendanceStatus.PRESENT)
                present += 1;
            if (attendance.status === AttendanceStatus.ABSENT)
                absent += 1;
            if (attendance.status === AttendanceStatus.RETARD)
                late += 1;
            if (attendance.status !== AttendanceStatus.ABSENT)
                laborCost = laborCost.plus(attendance.worker.dailyRate ?? 0);
        }
        return { totalRecords: attendances.length, present, absent, late, hours, laborCost };
    }
};
AttendanceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AttendanceService);
export { AttendanceService };
//# sourceMappingURL=attendance.service.js.map