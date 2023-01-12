"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaModule = void 0;
const common_1 = require("@nestjs/common");
const manga_service_1 = require("./manga.service");
const manga_resolver_1 = require("./manga.resolver");
const manga_dex_service_1 = require("../sources/manga-dex/manga-dex.service");
const manga_reader_service_1 = require("../sources/manga-reader/manga-reader.service");
const madara_service_1 = require("../sources/madara/madara.service");
const custom_service_1 = require("../sources/custom/custom.service");
const meili_service_1 = require("../meili.service");
let MangaModule = class MangaModule {
};
MangaModule = __decorate([
    (0, common_1.Module)({
        providers: [
            custom_service_1.CustomSourceService,
            madara_service_1.MadaraService,
            manga_resolver_1.MangaResolver,
            manga_service_1.MangaService,
            manga_reader_service_1.MangaReaderService,
            manga_dex_service_1.MangaDexService,
            meili_service_1.MeiliService,
        ],
    })
], MangaModule);
exports.MangaModule = MangaModule;
//# sourceMappingURL=manga.module.js.map