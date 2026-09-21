import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { FilesController } from './files.controller.js';
import { FilesService } from './files.service.js';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
