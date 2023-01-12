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
exports.GenresResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const genres_service_1 = require("./genres.service");
const genre_entity_1 = require("./entities/genre.entity");
const manga_input_1 = require("../manga/dto/manga.input");
let GenresResolver = class GenresResolver {
    constructor(genresService) {
        this.genresService = genresService;
    }
    findAll(genresInput) {
        return this.genresService.getAll(genresInput);
    }
};
__decorate([
    (0, graphql_1.Query)(() => [genre_entity_1.Genre], { name: "genres" }),
    __param(0, (0, graphql_1.Args)("genresInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manga_input_1.BaseInput]),
    __metadata("design:returntype", void 0)
], GenresResolver.prototype, "findAll", null);
GenresResolver = __decorate([
    (0, graphql_1.Resolver)(() => genre_entity_1.Genre),
    __metadata("design:paramtypes", [genres_service_1.GenresService])
], GenresResolver);
exports.GenresResolver = GenresResolver;
//# sourceMappingURL=genres.resolver.js.map