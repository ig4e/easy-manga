"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const custom_service_1 = require("../sources/custom/custom.service");
const madara_service_1 = require("../sources/madara/madara.service");
const manga_dex_service_1 = require("../sources/manga-dex/manga-dex.service");
const manga_reader_service_1 = require("../sources/manga-reader/manga-reader.service");
const manga_input_1 = require("./dto/manga.input");
const meili_service_1 = require("../meili.service");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
let MangaService = class MangaService {
    constructor(mangaReader, madara, customSource, mangaDex, meili) {
        this.mangaReader = mangaReader;
        this.madara = madara;
        this.customSource = customSource;
        this.mangaDex = mangaDex;
        this.meili = meili;
        this.axiosClient = axios_1.default.create({
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ keepAlive: true }),
        });
    }
    async search(input) {
        const { mangaReader, madara, custom } = manga_input_1.SourcesType;
        let mangaArrResult;
        if (mangaReader.includes(input.source)) {
            mangaArrResult = await this.mangaReader.search(input.source, input.query);
        }
        else if (madara.includes(input.source)) {
            mangaArrResult = await this.madara.search(input.source, input.query);
        }
        else if (custom.includes(input.source)) {
            mangaArrResult = await this.customSource.search(input.source, input.query);
        }
        return await this.addDexFieldsToArray(mangaArrResult);
    }
    async mangaList(input = { page: 1, source: manga_input_1.Sources.ARES }) {
        var _a, _b, _c;
        const { mangaReader, madara, custom } = manga_input_1.SourcesType;
        let mangaArrResult;
        if (mangaReader.includes(input.source)) {
            mangaArrResult = await this.mangaReader.mangaList(input.source, Object.assign({ page: input.page }, input.filters));
        }
        else if (madara.includes(input.source)) {
            mangaArrResult = await this.madara.mangaList(input.source, input.page);
        }
        else if (custom.includes(input.source)) {
            let order = "top";
            if (((_a = input === null || input === void 0 ? void 0 : input.filters) === null || _a === void 0 ? void 0 : _a.order) === manga_input_1.Order.LATEST)
                order = "new";
            if (((_b = input === null || input === void 0 ? void 0 : input.filters) === null || _b === void 0 ? void 0 : _b.order) === manga_input_1.Order.UPDATE)
                order = "latest";
            if (((_c = input === null || input === void 0 ? void 0 : input.filters) === null || _c === void 0 ? void 0 : _c.order) === manga_input_1.Order.POPULAR)
                order = "top";
            mangaArrResult = await this.customSource.mangaList(input.source, input.page, order);
        }
        return await this.addDexFieldsToArray(mangaArrResult);
    }
    async manga(input) {
        const { mangaReader, madara, custom } = manga_input_1.SourcesType;
        let resultManga;
        if (mangaReader.includes(input.source)) {
            const manga = await this.mangaReader.manga(input.source, input.slug);
            if (!manga)
                throw new common_1.NotFoundException();
            resultManga = manga;
        }
        else if (madara.includes(input.source)) {
            const manga = await this.madara.manga(input.source, input.slug);
            resultManga = manga;
        }
        else if (custom.includes(input.source)) {
            const manga = await this.customSource.manga(input.source, input.slug);
            resultManga = manga;
        }
        const withDex = await this.addDexFieldsToArray([resultManga]);
        return withDex[0];
    }
    async addDexFieldsToArray(manga) {
        const mangaWithDexFields = await Promise.all(manga.map(async (manga) => {
            var _a, _b;
            if (!manga)
                return manga;
            try {
                const dexStartDate = Date.now();
                const dexMangaData = await this.mangaDex.search(manga.title);
                const dexEndDate = Date.now();
                console.log(`MangaDex Time : ${dexEndDate - dexStartDate}ms`);
                if (!dexMangaData)
                    return manga;
                const attributes = dexMangaData.attributes || {};
                const links = attributes.links || {};
                const coverArts = ((_a = dexMangaData.relationships) === null || _a === void 0 ? void 0 : _a.filter((rel) => rel.type === 'cover_art')) || [];
                const neededInfo = {
                    dexId: dexMangaData.id,
                    aniId: links.al,
                    muId: links.mu,
                    cover: coverArts.length > 0 ? this.mangaReader.genereateImageUrl(`https://mangadex.org/covers/${dexMangaData.id}/${(_b = coverArts[0].attributes) === null || _b === void 0 ? void 0 : _b.fileName}`, "https://mangadex.org/") : undefined,
                    covers: coverArts.map((cover) => {
                        var _a, _b;
                        return ({
                            url: this.mangaReader.genereateImageUrl(`https://mangadex.org/covers/${dexMangaData.id}/${(_a = cover.attributes) === null || _a === void 0 ? void 0 : _a.fileName}`, "https://mangadex.org/"),
                            volume: ((_b = cover.attributes) === null || _b === void 0 ? void 0 : _b.volume) || "",
                        });
                    }),
                    altTitles: Array.isArray(attributes.altTitles)
                        ? attributes.altTitles.flatMap((titleObj) => typeof titleObj === 'object' ? Object.values(titleObj) : [titleObj]).filter((title) => typeof title === 'string')
                        : [],
                };
                const cleanManga = {
                    dexId: neededInfo.dexId,
                    aniId: neededInfo.aniId,
                    muId: neededInfo.muId,
                    slug: manga.slug,
                    url: manga.url,
                    cover: neededInfo.cover || manga.cover,
                    covers: neededInfo.covers,
                    title: manga.title,
                    altTitles: neededInfo.altTitles,
                    genres: manga.genres || [],
                    synopsis: manga.synopsis,
                    status: manga.status,
                    type: manga.type,
                    author: manga.author,
                    artist: manga.artist,
                    releaseYear: manga.releaseYear,
                    score: manga.score,
                    chapters: manga.chapters,
                    source: manga.source,
                };
                return cleanManga;
            }
            catch (error) {
                console.error("Error in addDexFieldsToArray:", error);
                return manga;
            }
        }));
        return mangaWithDexFields.filter((manga) => manga);
    }
};
MangaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [manga_reader_service_1.MangaReaderService,
        madara_service_1.MadaraService,
        custom_service_1.CustomSourceService,
        manga_dex_service_1.MangaDexService,
        meili_service_1.MeiliService])
], MangaService);
exports.MangaService = MangaService;
//# sourceMappingURL=manga.service.js.map