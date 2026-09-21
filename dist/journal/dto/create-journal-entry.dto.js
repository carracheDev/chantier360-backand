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
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
export class CreateJournalEntryDto {
    chantierId;
    date;
    progress;
    description;
    weather;
    observations;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "chantierId", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "date", void 0);
__decorate([
    Type(() => Number),
    IsNumber({ maxDecimalPlaces: 2 }),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], CreateJournalEntryDto.prototype, "progress", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "weather", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "observations", void 0);
//# sourceMappingURL=create-journal-entry.dto.js.map