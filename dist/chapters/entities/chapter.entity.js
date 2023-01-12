"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Chapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapter = void 0;
const graphql_1 = require("@nestjs/graphql");
const manga_input_1 = require("../../manga/dto/manga.input");
let Chapter = Chapter_1 = class Chapter {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Chapter.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Chapter.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Chapter.prototype, "mangaSlug", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Chapter.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Chapter.prototype, "number", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Chapter.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Chapter.prototype, "nextSlug", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Chapter.prototype, "prevSlug", void 0);
__decorate([
    (0, graphql_1.Field)(() => [Chapter_1]),
    __metadata("design:type", Array)
], Chapter.prototype, "otherChapters", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Chapter.prototype, "pages", void 0);
__decorate([
    (0, graphql_1.Field)((type) => manga_input_1.Sources, { defaultValue: "MANGAKAKALOT" }),
    __metadata("design:type", String)
], Chapter.prototype, "source", void 0);
Chapter = Chapter_1 = __decorate([
    (0, graphql_1.ObjectType)()
], Chapter);
exports.Chapter = Chapter;
//# sourceMappingURL=chapter.entity.js.map