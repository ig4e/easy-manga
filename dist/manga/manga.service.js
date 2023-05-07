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
const fuse_js_1 = __importDefault(require("fuse.js"));
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
        let { mangaReader, madara, custom } = manga_input_1.SourcesType;
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
        let { mangaReader, madara, custom } = manga_input_1.SourcesType;
        let mangaArrResult;
        if (mangaReader.includes(input.source)) {
            mangaArrResult = await this.mangaReader.mangaList(input.source, Object.assign({ page: input.page }, input.filters));
        }
        else if (madara.includes(input.source)) {
            mangaArrResult = await this.madara.mangaList(input.source, input.page);
        }
        else if (custom.includes(input.source)) {
            let order = "top";
            if (input.filters.order === manga_input_1.Order.LATEST)
                order = "new";
            if (input.filters.order === manga_input_1.Order.UPDATE)
                order = "latest";
            if (input.filters.order === manga_input_1.Order.POPULAR)
                order = "top";
            mangaArrResult = await this.customSource.mangaList(input.source, input.page, order);
        }
        return await this.addDexFieldsToArray(mangaArrResult);
    }
    async manga(input) {
        let { mangaReader, madara, custom } = manga_input_1.SourcesType;
        let resultManga;
        if (mangaReader.includes(input.source)) {
            let manga = await this.mangaReader.manga(input.source, input.slug);
            if (!manga)
                throw new common_1.NotFoundException();
            resultManga = manga;
        }
        else if (madara.includes(input.source)) {
            let manga = await this.madara.manga(input.source, input.slug);
            resultManga = manga;
        }
        else if (custom.includes(input.source)) {
            let manga = await this.customSource.manga(input.source, input.slug);
            resultManga = manga;
        }
        const withDex = await this.addDexFieldsToArray([resultManga]);
        return withDex[0];
    }
    async addDexFieldsToArray(manga) {
        return manga;
        const mangaWithDexFields = await Promise.all(manga.map(async (manga) => {
            var _a, _b;
            if (!manga)
                return manga;
            let atlasStartDate = Date.now();
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url: "https://data.mongodb-api.com/app/data-ykgku/endpoint/data/v1/action/aggregate",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Request-Headers": "*",
                    "api-key": "6kCvNRcJ63IfZ0fyNSNjXn7J1PXy7NLYYx4ovzrfV57V0BSLR8EGotFyuUOXWrm3",
                },
                data: {
                    dataSource: "Cluster0",
                    database: "prod",
                    collection: "Manga",
                    pipeline: [
                        {
                            $search: {
                                index: "default",
                                compound: {
                                    should: [
                                        {
                                            text: {
                                                query: manga.title,
                                                path: "title.en",
                                                score: {
                                                    boost: {
                                                        value: 2,
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            text: {
                                                query: manga.title,
                                                path: "altTitles",
                                                score: {
                                                    boost: {
                                                        value: 1.5,
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $limit: 16,
                        },
                    ],
                },
            });
            let atlasEndDate = Date.now();
            console.log(`Atlas Time : ${atlasEndDate - atlasStartDate}ms`);
            const fuse = new fuse_js_1.default(data.documents, {
                keys: ["title.en", "altTitles"],
            });
            const fuseResult = fuse.search(manga.title);
            const dexMangaData = (_a = fuseResult === null || fuseResult === void 0 ? void 0 : fuseResult[0]) === null || _a === void 0 ? void 0 : _a.item;
            if (!dexMangaData)
                return manga;
            const neededInfo = {
                dexId: dexMangaData === null || dexMangaData === void 0 ? void 0 : dexMangaData.dexId,
                aniId: dexMangaData === null || dexMangaData === void 0 ? void 0 : dexMangaData.links.al,
                muId: dexMangaData === null || dexMangaData === void 0 ? void 0 : dexMangaData.links.mu,
                cover: this.mangaReader.genereateImageUrl(`https://mangadex.org/covers/${dexMangaData.dexId}/${(_b = dexMangaData === null || dexMangaData === void 0 ? void 0 : dexMangaData.covers) === null || _b === void 0 ? void 0 : _b[(dexMangaData === null || dexMangaData === void 0 ? void 0 : dexMangaData.covers.length) - 1].fileName}`, "https://mangadex.org/"),
                covers: dexMangaData.covers.map((cover) => {
                    return {
                        url: this.mangaReader.genereateImageUrl(`https://mangadex.org/covers/${dexMangaData.dexId}/${cover.fileName}`, "https://mangadex.org/"),
                        volume: cover.volume,
                    };
                }),
                altTitles: dexMangaData.altTitles,
            };
            return Object.assign(Object.assign({}, manga), neededInfo);
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