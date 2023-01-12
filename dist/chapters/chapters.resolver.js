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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaptersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const manga_service_1 = require(".././manga/manga.service");
const chapters_service_1 = require("./chapters.service");
const chapter_input_1 = require("./dto/chapter.input");
const chapter_entity_1 = require("./entities/chapter.entity");
let ChaptersResolver = class ChaptersResolver {
    constructor(chaptersService, mangaService) {
        this.chaptersService = chaptersService;
        this.mangaService = mangaService;
    }
    findOne(chapterUniqueInput) {
        return this.chaptersService.chapter(chapterUniqueInput);
    }
    async otherChapters(parent) {
        let manga = await this.mangaService.manga({
            slug: parent.mangaSlug,
            source: parent.source,
        });
        return manga.chapters;
    }
};
__decorate([
    (0, graphql_1.Query)(() => chapter_entity_1.Chapter, { name: "chapter" }),
    __param(0, (0, graphql_1.Args)("chapterUniqueInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chapter_input_1.ChapterUniqueInput]),
    __metadata("design:returntype", void 0)
], ChaptersResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.ResolveField)("otherChapters", () => [chapter_entity_1.Chapter]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chapter_entity_1.Chapter]),
    __metadata("design:returntype", Promise)
], ChaptersResolver.prototype, "otherChapters", null);
ChaptersResolver = __decorate([
    (0, graphql_1.Resolver)(() => chapter_entity_1.Chapter),
    __metadata("design:paramtypes", [chapters_service_1.ChaptersService,
        manga_service_1.MangaService])
], ChaptersResolver);
exports.ChaptersResolver = ChaptersResolver;
//# sourceMappingURL=chapters.resolver.js.map