var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IncidentSeverity, IncidentStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class UpdateIncidentDto {
    title;
    description;
    severity;
    status;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsEnum(IncidentSeverity),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "severity", void 0);
__decorate([
    IsOptional(),
    IsEnum(IncidentStatus),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "status", void 0);
//# sourceMappingURL=update-incident.dto.js.map