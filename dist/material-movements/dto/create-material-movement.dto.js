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
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { MaterialMovementType } from '@prisma/client';
export class CreateMaterialMovementDto {
    chantierId;
    materialId;
    type;
    quantity;
    unitCost;
    date;
    reference;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "chantierId", void 0);
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "materialId", void 0);
__decorate([
    IsEnum(MaterialMovementType),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "type", void 0);
__decorate([
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 3 }),
    Min(0.001),
    __metadata("design:type", Number)
], CreateMaterialMovementDto.prototype, "quantity", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], CreateMaterialMovementDto.prototype, "unitCost", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "date", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "reference", void 0);
//# sourceMappingURL=create-material-movement.dto.js.map