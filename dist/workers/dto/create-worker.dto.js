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
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
export class CreateWorkerDto {
    chantierId;
    name;
    function;
    phone;
    dailyRate;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateWorkerDto.prototype, "chantierId", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateWorkerDto.prototype, "name", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateWorkerDto.prototype, "function", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateWorkerDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    __metadata("design:type", Number)
], CreateWorkerDto.prototype, "dailyRate", void 0);
//# sourceMappingURL=create-worker.dto.js.map