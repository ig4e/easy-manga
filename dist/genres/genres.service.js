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
exports.GenresService = void 0;
const common_1 = require("@nestjs/common");
const manga_reader_service_1 = require("../sources/manga-reader/manga-reader.service");
const manga_input_1 = require("../manga/dto/manga.input");
let GenresService = class GenresService {
    constructor(mangaReader) {
        this.mangaReader = mangaReader;
    }
    getAll(input) {
        let { mangaReader } = manga_input_1.SourcesType;
        if (mangaReader.includes(input.source)) {
            return this.mangaReader.getSoruceGenres(input.source);
        }
    }
};
GenresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [manga_reader_service_1.MangaReaderService])
], GenresService);
exports.GenresService = GenresService;
//# sourceMappingURL=genres.service.js.map