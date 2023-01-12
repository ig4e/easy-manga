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
exports.SourcesDataController = void 0;
const common_1 = require("@nestjs/common");
const manga_input_1 = require("../manga/dto/manga.input");
const custom_service_1 = require("./custom/custom.service");
const manga_reader_service_1 = require("./manga-reader/manga-reader.service");
let SourcesDataController = class SourcesDataController {
    constructor(mangaReader, customSource) {
        this.mangaReader = mangaReader;
        this.customSource = customSource;
    }
    async search(source, query) {
        return this.mangaReader.search(source, query);
    }
    async mangaList(source, filters) {
        return this.mangaReader.mangaList(source, filters);
    }
    async manga(source, slug) {
        return this.mangaReader.manga(source, slug);
    }
    async chapter(source, slug) {
        return this.mangaReader.chapter(source, slug);
    }
    async customSourceManga(slug) {
        return this.customSource.manga(manga_input_1.Sources.TEAMX, slug);
    }
    async customSourceMangalist(page) {
        return this.customSource.mangaList(manga_input_1.Sources.TEAMX, Number(page), "top");
    }
    async customSourceSearch(query) {
        return this.customSource.search(manga_input_1.Sources.TEAMX, query);
    }
    async customSourceChapter(slug) {
        return this.customSource.chapter(manga_input_1.Sources.TEAMX, slug);
    }
};
__decorate([
    (0, common_1.Get)("/search"),
    __param(0, (0, common_1.Query)("source")),
    __param(1, (0, common_1.Query)("query")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SourcesDataController.prototype, "search", null);
__decorate([
    (0, common_1.Get)("/manga-list"),
    __param(0, (0, common_1.Query)("source")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, manga_input_1.MangaListFilters]),
    __metadata("design:returntype", Promise)
], SourcesDataController.prototype, "mangaList", null);
__decorate([
    (0, common_1.Get)("/manga"),
    __param(0, (0, common_1.Query)("source")),
    __param(1, (0, common_1.Query)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SourcesDataController.prototype, "manga", null);
__decorate([
    (0, common_1.Get)("/chapter"),
    __param(0, (0, common_1.Query)("source")),
    __param(1, (0, common_1.Query)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SourcesDataController.prototype, "chapter", null);
__decorate([
    (0, common_1.Get)("/custom-source/manga"),
    __param(0, (0, common_1.Query)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SourcesDataController.prototype, "customSourceManga", null);
__decorate([
    (0, common_1.Get)("/custom-source/list"),
    __param(0, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SourcesDataController.prototype, "customSourceMangalist", null);
__decorate([
    (0, common_1.Get)("/custom-source/search"),
    __param(0, (0, common_1.Query)("query")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SourcesDataController.prototype, "customSourceSearch", null);
__decorate([
    (0, common_1.Get)("/custom-source/chapter"),
    __param(0, (0, common_1.Query)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SourcesDataController.prototype, "customSourceChapter", null);
SourcesDataController = __decorate([
    (0, common_1.Controller)("sources-data"),
    __metadata("design:paramtypes", [manga_reader_service_1.MangaReaderService,
        custom_service_1.CustomSourceService])
], SourcesDataController);
exports.SourcesDataController = SourcesDataController;
//# sourceMappingURL=sources-data.controller.js.map