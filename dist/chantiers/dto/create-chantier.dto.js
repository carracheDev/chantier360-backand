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
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ChantierStatus } from '@prisma/client';
export class CreateChantierDto {
    name;
    description;
    location;
    budget;
    progress;
    startDate;
    endDate;
    status;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateChantierDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateChantierDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateChantierDto.prototype, "location", void 0);
__decorate([
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], CreateChantierDto.prototype, "budget", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], CreateChantierDto.prototype, "progress", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateChantierDto.prototype, "startDate", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateChantierDto.prototype, "endDate", void 0);
__decorate([
    IsOptional(),
    IsEnum(ChantierStatus),
    __metadata("design:type", String)
], CreateChantierDto.prototype, "status", void 0);
//# sourceMappingURL=create-chantier.dto.js.map