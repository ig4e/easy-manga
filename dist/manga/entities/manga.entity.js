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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manga = void 0;
const graphql_1 = require("@nestjs/graphql");
const chapter_entity_1 = require("../../chapters/entities/chapter.entity");
const manga_input_1 = require("../dto/manga.input");
let Manga = class Manga {
};
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Manga.prototype, "dexId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Manga.prototype, "aniId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Manga.prototype, "muId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Manga.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Manga.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Manga.prototype, "cover", void 0);
__decorate([
    (0, graphql_1.Field)(() => [MangaCover], { nullable: true }),
    __metadata("design:type", Array)
], Manga.prototype, "covers", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Manga.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Manga.prototype, "altTitles", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Manga.prototype, "genres", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Manga.prototype, "synopsis", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Manga.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Manga.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Manga.prototype, "author", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Manga.prototype, "artist", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Manga.prototype, "releaseYear", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], Manga.prototype, "score", void 0);
__decorate([
    (0, graphql_1.Field)(() => [chapter_entity_1.Chapter], { nullable: true }),
    __metadata("design:type", Array)
], Manga.prototype, "chapters", void 0);
__decorate([
    (0, graphql_1.Field)((type) => manga_input_1.Sources, { defaultValue: "MANGAKAKALOT" }),
    __metadata("design:type", String)
], Manga.prototype, "source", void 0);
Manga = __decorate([
    (0, graphql_1.ObjectType)()
], Manga);
exports.Manga = Manga;
let MangaCover = class MangaCover {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MangaCover.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MangaCover.prototype, "volume", void 0);
MangaCover = __decorate([
    (0, graphql_1.ObjectType)()
], MangaCover);
//# sourceMappingURL=manga.entity.js.map