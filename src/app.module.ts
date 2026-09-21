import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { AuditModule } from './audit/audit.module.js';
import { AlertsModule } from './alerts/alerts.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { CompaniesModule } from './companies/companies.module.js';
import { ChantiersModule } from './chantiers/chantiers.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { FilesModule } from './files/files.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { JournalModule } from './journal/journal.module.js';
import { IncidentsModule } from './incidents/incidents.module.js';
import { MaterialMovementsModule } from './material-movements/material-movements.module.js';
import { MaterialsModule } from './materials/materials.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProjectMembersModule } from './project-members/project-members.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { RolesModule } from './roles/roles.module.js';
import { UsersModule } from './users/users.module.js';
import { WorkersModule } from './workers/workers.module.js';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AuditModule,
    AlertsModule,
    AttendanceModule,
    CompaniesModule,
    ChantiersModule,
    ExpensesModule,
    FilesModule,
    DashboardModule,
    JournalModule,
    IncidentsModule,
    MaterialsModule,
    MaterialMovementsModule,
    RolesModule,
    UsersModule,
    WorkersModule,
    TasksModule,
    ProjectMembersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
