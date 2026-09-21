var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
export class CreateAttendanceDto {
    chantierId;
    workerId;
    date;
    status;
    hours;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "chantierId", void 0);
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "workerId", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "date", void 0);
__decorate([
    IsEnum(AttendanceStatus),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    Max(24),
    __metadata("design:type", Number)
], CreateAttendanceDto.prototype, "hours", void 0);
//# sourceMappingURL=create-attendance.dto.js.map