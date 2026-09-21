import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JournalStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto.js';
import { CreatePhotoDto } from './dto/create-photo.dto.js';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto.js';

const journalSelect = {
  id: true,
  companyId: true,
  chantierId: true,
  userId: true,
  date: true,
  progress: true,
  description: true,
  weather: true,
  observations: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true, email: true } },
  photos: { select: { id: true, url: true, caption: true, createdAt: true }, orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.JournalEntrySelect;

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string, userId: string, chantierId?: string) {
    return this.prisma.journalEntry.findMany({
      where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
      orderBy: { date: 'desc' },
      select: journalSelect,
    });
  }

  async findOne(companyId: string, userId: string, journalId: string) {
    return this.findAccessibleJournal(companyId, userId, journalId);
  }

  async create(companyId: string, userId: string, input: CreateJournalEntryDto) {
    await this.assertMembership(companyId, userId, input.chantierId);
    try {
      return await this.prisma.journalEntry.create({
        data: {
          companyId,
          chantierId: input.chantierId,
          userId,
          date: new Date(input.date),
          progress: input.progress.toString(),
          description: input.description.trim(),
          weather: input.weather?.trim(),
          observations: input.observations?.trim(),
        },
        select: journalSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Un journal existe déjà pour ce chantier et cette date.');
      }
      throw error;
    }
  }

  async update(companyId: string, userId: string, journalId: string, input: UpdateJournalEntryDto) {
    const journal = await this.findAccessibleJournal(companyId, userId, journalId);
    if (journal.status !== JournalStatus.BROUILLON) {
      throw new BadRequestException('Seul un journal brouillon peut être modifié.');
    }

    return this.prisma.journalEntry.update({
      where: { id: journalId },
      data: {
        date: input.date ? new Date(input.date) : undefined,
        progress: input.progress === undefined ? undefined : input.progress.toString(),
        description: input.description?.trim(),
        weather: input.weather?.trim(),
        observations: input.observations?.trim(),
      },
      select: journalSelect,
    });
  }

  async submit(companyId: string, userId: string, journalId: string) {
    await this.findAccessibleJournal(companyId, userId, journalId);
    const result = await this.prisma.journalEntry.updateMany({
      where: { id: journalId, companyId, status: JournalStatus.BROUILLON },
      data: { status: JournalStatus.SOUMIS },
    });
    if (result.count === 0) throw new BadRequestException('Le journal ne peut pas être soumis dans son état actuel.');
    return this.findAccessibleJournal(companyId, userId, journalId);
  }

  async validate(companyId: string, userId: string, journalId: string) {
    await this.findAccessibleJournal(companyId, userId, journalId);
    const result = await this.prisma.journalEntry.updateMany({
      where: { id: journalId, companyId, status: JournalStatus.SOUMIS },
      data: { status: JournalStatus.VALIDE },
    });
    if (result.count === 0) throw new BadRequestException('Le journal ne peut pas être validé dans son état actuel.');
    return this.findAccessibleJournal(companyId, userId, journalId);
  }

  async addPhoto(companyId: string, userId: string, journalId: string, input: CreatePhotoDto) {
    const journal = await this.findAccessibleJournal(companyId, userId, journalId);
    if (journal.status === JournalStatus.VALIDE) {
      throw new BadRequestException('Un journal validé ne peut plus recevoir de photo.');
    }
    return this.prisma.photo.create({
      data: { journalEntryId: journalId, url: input.url, caption: input.caption?.trim() },
      select: { id: true, journalEntryId: true, url: true, caption: true, createdAt: true },
    });
  }

  async findPhotos(companyId: string, userId: string, journalId: string) {
    await this.findAccessibleJournal(companyId, userId, journalId);
    return this.prisma.photo.findMany({
      where: { journalEntryId: journalId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, journalEntryId: true, url: true, caption: true, createdAt: true },
    });
  }

  private async assertMembership(companyId: string, userId: string, chantierId: string) {
    const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId }, select: { userId: true } });
    if (!membership) throw new NotFoundException('Chantier ou affectation introuvable.');
  }

  private async findAccessibleJournal(companyId: string, userId: string, journalId: string) {
    const journal = await this.prisma.journalEntry.findFirst({
      where: { id: journalId, companyId, chantier: { companyId, projectMembers: { some: { companyId, userId } } } },
      select: journalSelect,
    });
    if (!journal) throw new NotFoundException('Journal introuvable ou inaccessible.');
    return journal;
  }
}
