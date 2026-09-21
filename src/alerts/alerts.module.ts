import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DashboardModule } from '../dashboard/dashboard.module.js';
import { AlertsController } from './alerts.controller.js';

@Module({
  imports: [AuthModule, DashboardModule],
  controllers: [AlertsController],
})
export class AlertsModule {}
