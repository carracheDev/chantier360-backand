import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ChantiersController } from './chantiers.controller.js';
import { ChantiersService } from './chantiers.service.js';

@Module({
  imports: [AuthModule],
  controllers: [ChantiersController],
  providers: [ChantiersService],
})
export class ChantiersModule {}
