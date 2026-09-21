import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MaterialMovementsController } from './material-movements.controller.js';
import { MaterialMovementsService } from './material-movements.service.js';

@Module({
  imports: [AuthModule],
  controllers: [MaterialMovementsController],
  providers: [MaterialMovementsService],
})
export class MaterialMovementsModule {}
