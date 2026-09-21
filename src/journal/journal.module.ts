import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { JournalController } from './journal.controller.js';
import { JournalService } from './journal.service.js';

@Module({
  imports: [AuthModule],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}
