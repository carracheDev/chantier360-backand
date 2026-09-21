import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { PermissionsGuard } from './permissions.guard.js';
import { ChantierAccessGuard } from './chantier-access.guard.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, PermissionsGuard, ChantierAccessGuard],
  exports: [AuthService, JwtAuthGuard, PermissionsGuard, ChantierAccessGuard],
})
export class AuthModule {}
