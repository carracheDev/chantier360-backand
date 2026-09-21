var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ReportType } from '@prisma/client';
import { IsDateString, IsEnum, IsUUID } from 'class-validator';
export class CreateReportDto {
    chantierId;
    type;
    periodStart;
    periodEnd;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "chantierId", void 0);
__decorate([
    IsEnum(ReportType),
    __metadata("design:type", String)
], CreateReportDto.prototype, "type", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "periodStart", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "periodEnd", void 0);
//# sourceMappingURL=create-report.dto.js.map