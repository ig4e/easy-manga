"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaDexService = void 0;
const common_1 = require("@nestjs/common");
const got_scraping_1 = require("got-scraping");
const fuse_js_1 = __importDefault(require("fuse.js"));
const gotInstance = got_scraping_1.gotScraping.extend({
    cache: true,
    cacheOptions: {
        shared: true,
    },
    dnsCache: true,
});
let MangaDexService = class MangaDexService {
    async search(query) {
        var _a, _b;
        try {
            const { body } = await gotInstance(`https://api.mangadex.org/manga?limit=16&offset=0&includes[]=cover_art&includes[]=author&includes[]=artist&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=${encodeURIComponent(query)}&order[relevance]=desc`, { responseType: "json" });
            const fuse = new fuse_js_1.default(body.data, {
                keys: [
                    "attributes.title.en",
                    "attributes.altTitles.en",
                    "attributes.altTitles.ja-ro",
                    "attributes.altTitles.zh-ro",
                    "attributes.altTitles.ko-ro",
                ],
                includeScore: true,
            });
            return (_b = (_a = fuse.search(query)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.item;
        }
        catch (_c) {
            return await this.search(query);
        }
    }
};
MangaDexService = __decorate([
    (0, common_1.Injectable)()
], MangaDexService);
exports.MangaDexService = MangaDexService;
//# sourceMappingURL=manga-dex.service.js.map