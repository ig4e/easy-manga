"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaptersModule = void 0;
const common_1 = require("@nestjs/common");
const chapters_service_1 = require("./chapters.service");
const chapters_resolver_1 = require("./chapters.resolver");
const manga_reader_service_1 = require("../sources/manga-reader/manga-reader.service");
const manga_service_1 = require(".././manga/manga.service");
const manga_dex_service_1 = require("../sources/manga-dex/manga-dex.service");
const madara_service_1 = require("../sources/madara/madara.service");
const custom_service_1 = require("../sources/custom/custom.service");
const meili_service_1 = require("../meili.service");
let ChaptersModule = class ChaptersModule {
};
ChaptersModule = __decorate([
    (0, common_1.Module)({
        providers: [chapters_resolver_1.ChaptersResolver, chapters_service_1.ChaptersService, manga_reader_service_1.MangaReaderService, manga_service_1.MangaService, manga_dex_service_1.MangaDexService, madara_service_1.MadaraService, custom_service_1.CustomSourceService, meili_service_1.MeiliService]
    })
], ChaptersModule);
exports.ChaptersModule = ChaptersModule;
//# sourceMappingURL=chapters.module.js.map