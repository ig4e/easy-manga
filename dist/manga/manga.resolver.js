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
exports.MangaResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const manga_service_1 = require("./manga.service");
const manga_entity_1 = require("./entities/manga.entity");
const manga_input_1 = require("./dto/manga.input");
const nestjs_gql_cache_control_1 = require("nestjs-gql-cache-control");
let MangaResolver = class MangaResolver {
    constructor(mangaService) {
        this.mangaService = mangaService;
    }
    async search(searchInput) {
        try {
            console.time("search-" + searchInput.source);
            const searchResult = await this.mangaService.search(searchInput);
            console.timeEnd("search-" + searchInput.source);
            return searchResult;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async findOne(mangaUniqueInput) {
        return await this.mangaService.manga(mangaUniqueInput);
    }
    async findAll(mangaListInput) {
        const mangaList = await this.mangaService.mangaList(mangaListInput);
        return mangaList;
    }
};
__decorate([
    (0, graphql_1.Query)(() => [manga_entity_1.Manga], { name: "search" }),
    (0, nestjs_gql_cache_control_1.CacheControl)({ maxAge: 10, scope: "PUBLIC" }),
    __param(0, (0, graphql_1.Args)("searchInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manga_input_1.MangaSearchInput]),
    __metadata("design:returntype", Promise)
], MangaResolver.prototype, "search", null);
__decorate([
    (0, graphql_1.Query)(() => manga_entity_1.Manga, { name: "manga" }),
    (0, nestjs_gql_cache_control_1.CacheControl)({ maxAge: 10, scope: "PUBLIC" }),
    __param(0, (0, graphql_1.Args)("mangaUniqueInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manga_input_1.MangaUniqueInput]),
    __metadata("design:returntype", Promise)
], MangaResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [manga_entity_1.Manga], { name: "mangaList" }),
    (0, nestjs_gql_cache_control_1.CacheControl)({ maxAge: 10, scope: "PUBLIC" }),
    __param(0, (0, graphql_1.Args)("mangaListInput", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manga_input_1.MangalistInput]),
    __metadata("design:returntype", Promise)
], MangaResolver.prototype, "findAll", null);
MangaResolver = __decorate([
    (0, graphql_1.Resolver)(() => manga_entity_1.Manga),
    __metadata("design:paramtypes", [manga_service_1.MangaService])
], MangaResolver);
exports.MangaResolver = MangaResolver;
//# sourceMappingURL=manga.resolver.js.map