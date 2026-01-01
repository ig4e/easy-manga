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
exports.MangaReaderService = void 0;
const common_1 = require("@nestjs/common");
const got_scraping_1 = require("got-scraping");
const slim_1 = require("cheerio/lib/slim");
const urlHandle = __importStar(require("url-query-handle"));
const eval_1 = __importDefault(require("eval"));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";
let cookies = "";
const gotInstance = got_scraping_1.gotScraping.extend({
    cache: true,
    cacheOptions: {
        shared: true,
    },
    dnsCache: true,
});
const DEFAULT_SOURCE_SETTINGS = {
    pathes: { manga: "/manga" },
    selectors: {
        mangaList: {
            list: "div.listupd > div.bs",
            dropdown: {
                genre: "div.filter.dropdown > ul.genrez > li",
            },
            cover: "img.wp-post-image",
            url: "div.bsx > a",
            score: "div.numscore",
            latestChapterName: "div.adds > div.epxs",
        },
        manga: {
            title: "h1.entry-title",
            altTitles: "#titlemove > span.alternative",
            cover: "div.thumb > img",
            status: "div.tsinfo.bixbox > div:nth-child(1) > i",
            type: "div.tsinfo.bixbox > div:nth-child(2) > a",
            author: "div.tsinfo.bixbox > div:nth-child(3) > i",
            artist: `div.tsinfo.bixbox > div:nth-child(4) > i`,
            releasedAt: "",
            synopsis: `div.entry-content.entry-content-single > p`,
            score: `div.rating.bixbox > div > div.num`,
            genre: "a[rel='tag']",
            chapter: {
                list: "#chapterlist > ul > li",
                url: "a",
                number: "li",
                name: "span.chapternum",
            },
        },
        chapter: {
            name: "div.headpost > h1.entry-title",
        },
    },
};
const SOURCES = {
    ARENASCANS: Object.assign({ url: "https://arenascans.net" }, DEFAULT_SOURCE_SETTINGS),
    ARES: Object.assign(Object.assign({ url: "https://manhuascarlet.com" }, DEFAULT_SOURCE_SETTINGS), { pathes: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.pathes), { manga: "/series" }) }),
    OZULSCANS: Object.assign({ url: "https://king-ofmanga.com" }, DEFAULT_SOURCE_SETTINGS),
    GALAXYMANGA: Object.assign(Object.assign({ url: "https://flixscans.com" }, DEFAULT_SOURCE_SETTINGS), { pathes: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.pathes), { manga: "/series" }), selectors: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.selectors), { manga: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.selectors.manga), { synopsis: `div.entry-content.entry-content-single > blockquote > p` }) }) }),
    MANGASWAT: {
        url: "https://swatmanhua.com",
        pathes: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.pathes), { manga: "/manga" }),
        selectors: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.selectors), { manga: {
                title: "div.infox > h1",
                altTitles: "",
                cover: "div.thumb > img",
                score: "",
                genre: "div.bixbox.animefull > div.bigcontent > div.infox > div.spe > span > a[rel='tag']",
                type: `div.infox > div.spe > span:nth-child(4) > a`,
                artist: "",
                author: "div.infox > div.spe > span:nth-child(3)",
                chapter: {
                    list: "div.bixbox.bxcl > ul > li",
                    name: "li > span.lchx > a",
                    number: "",
                    url: "li > span.lchx > a",
                },
                status: "div.infox > div.spe > span:nth-child(2)",
                synopsis: `div.infox > div.desc > div > span > p`,
                releasedAt: `div.infox > div.spe > span > time`,
            } }),
    },
};
let MangaReaderService = class MangaReaderService {
    constructor() { }
    async search(source, query) {
        try {
            const SOURCE = SOURCES[source];
            const { body } = await gotInstance.post(SOURCE.url + `/wp-admin/admin-ajax.php`, {
                headers: {
                    "x-requested-with": "XMLHttpRequest",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: "action=ts_ac_do_search&ts_ac_query=" +
                    encodeURIComponent(query),
                timeout: { response: 5 * 1000 },
            });
            const all = JSON.parse(body).series[0].all;
            return all
                .map((e) => {
                const slug = this.getMangaSlug(source, e.post_link);
                let manga = {
                    slug,
                    url: e.post_link,
                    title: e.post_title,
                    cover: this.genereateImageUrl(e.post_image, SOURCE.url),
                    altTitles: [],
                    genres: e.post_genres.split(", "),
                    score: 0,
                    chapters: [
                        {
                            mangaSlug: slug,
                            name: e.post_latest,
                            number: this.getChapterNumber(e.post_latest),
                            source: source,
                        },
                    ],
                    source: source,
                };
                return manga;
            })
                .filter((x) => x);
        }
        catch (_a) {
            return [];
        }
    }
    async mangaList(source, mangaListOptions = { page: 1 }) {
        const SOURCE = SOURCES[source];
        const results = [];
        const url = urlHandle
            .addMultipleParams(SOURCE.url + SOURCE.pathes.manga, mangaListOptions)
            .replace("genre", "genre[]");
        const { body, ok, statusCode, statusMessage } = await this.get({
            url,
            dnsCache: true,
        });
        if (ok) {
            const $ = (0, slim_1.load)(body);
            $(`div.listupd > div.bs`).each((i, el) => {
                var _a, _b, _c;
                const $$ = (0, slim_1.load)(el);
                const a = $$("div.bsx > a");
                const title = a.attr("title");
                if (title.includes("Novel"))
                    return;
                const url = a.attr("href");
                const slug = this.getMangaSlug(source, url);
                const chapterName = (_a = $$(`div.adds > div.epxs`).text()) === null || _a === void 0 ? void 0 : _a.trim();
                const chapterNumber = this.getChapterNumber(chapterName);
                results.push({
                    slug,
                    url,
                    title,
                    cover: this.genereateImageUrl($$(`img.wp-post-image`).attr("src"), SOURCE.url),
                    altTitles: [],
                    genres: [],
                    score: (_c = Number((_b = $$(`div.numscore`).text()) === null || _b === void 0 ? void 0 : _b.trim())) !== null && _c !== void 0 ? _c : 0,
                    chapters: [
                        {
                            slug: "",
                            url: "",
                            mangaSlug: slug,
                            name: chapterName,
                            number: chapterNumber,
                            source: source,
                        },
                    ],
                    source: source,
                });
            });
        }
        else {
            console.log(ok, statusCode, url);
            throw new common_1.UnprocessableEntityException(statusCode, statusMessage);
        }
        return results;
    }
    async manga(source, slug) {
        var _a;
        const SOURCE = SOURCES[source];
        const mangaSelectors = SOURCE.selectors.manga;
        const url = SOURCE.url + SOURCE.pathes.manga + `/${slug}`;
        const { body, ok } = await this.get({
            url,
            dnsCache: true,
        });
        if (ok) {
            const $ = (0, slim_1.load)(body);
            let mangaInfo = {
                slug,
                url,
                title: $(mangaSelectors.title).text(),
                altTitles: ((_a = $(mangaSelectors.altTitles)
                    .text()) === null || _a === void 0 ? void 0 : _a.split(/(\,|\|) ?/g).filter((title) => title.length > 1)) || [],
                cover: this.genereateImageUrl($(mangaSelectors.cover).attr("src"), SOURCE.url),
                status: $(mangaSelectors.status).text(),
                type: $(mangaSelectors.type).text(),
                author: $(mangaSelectors.author).text(),
                artist: $(mangaSelectors.artist).text(),
                releaseYear: new Date().getFullYear(),
                synopsis: $(mangaSelectors.synopsis).text(),
                score: Number($(mangaSelectors.score).text()),
                genres: [],
                chapters: [],
                source: source,
            };
            $(mangaSelectors.chapter.list).each((i, el) => {
                var _a;
                const $$ = (0, slim_1.load)(el);
                const url = $$(mangaSelectors.chapter.url).attr("href");
                const name = (_a = $$(mangaSelectors.chapter.name).text()) === null || _a === void 0 ? void 0 : _a.trim();
                mangaInfo.chapters.push({
                    slug: this.getChapterSlug(source, url),
                    url,
                    mangaSlug: slug,
                    name: name,
                    number: Number($$(mangaSelectors.chapter.number).attr("data-num")) || this.getChapterNumber(name),
                    source: source,
                });
            });
            $(mangaSelectors.genre).each((i, el) => {
                var _a;
                const $$ = (0, slim_1.load)(el);
                mangaInfo.genres.push((_a = $$("a").text()) === null || _a === void 0 ? void 0 : _a.trim());
            });
            return mangaInfo;
        }
    }
    async chapter(source, slug) {
        var _a;
        const SOURCE = SOURCES[source];
        const url = SOURCE.url + `/${slug}`;
        const { body, ok } = await this.get({
            url,
            dnsCache: true,
        });
        if (ok) {
            const $ = (0, slim_1.load)(body);
            const name = $(`div.headpost > h1.entry-title`).text();
            const mangaUrl = $(`div.headpost > div > a`).attr("href");
            const chapter = {
                url,
                slug: this.getChapterSlug(source, url),
                mangaSlug: this.getMangaSlug(source, mangaUrl),
                name: name,
                number: this.getChapterNumber(name),
                nextSlug: "",
                prevSlug: "",
                pages: [],
                source: source,
            };
            let chapterData = JSON.parse(body
                .match(/ts\_reader.run\({.+\}/m)[0]
                .replace("ts_reader.run(", ""));
            chapter.prevSlug = this.getChapterSlug(source, chapterData.prevUrl);
            chapter.nextSlug = this.getChapterSlug(source, chapterData.nextUrl);
            chapter.pages = (_a = chapterData.sources[0].images) === null || _a === void 0 ? void 0 : _a.map((img) => this.genereateImageUrl(img, SOURCE.url));
            return chapter;
        }
        else {
        }
    }
    genereateImageUrl(url, referer) {
        return `https://easymangaproxy.sekai966.workers.dev/fetch?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}`;
    }
    async getSoruceGenres(source) {
        const SOURCE = SOURCES[source];
        const { body, ok } = await this.get({
            url: SOURCE.url + SOURCE.pathes.manga,
            dnsCache: true,
        });
        const genres = [];
        if (ok) {
            const $ = (0, slim_1.load)(body);
            $(SOURCE.selectors.mangaList.dropdown.genre).each((i, el) => {
                var _a;
                const $$ = (0, slim_1.load)(el);
                const id = $$(`input`).attr("value");
                const genre = {
                    id: Number(id),
                    name: (_a = $$(`label`).text()) === null || _a === void 0 ? void 0 : _a.trim(),
                };
                genres.push(genre);
            });
        }
        return genres;
    }
    getMangaSlug(source, url) {
        const SOURCE = SOURCES[source];
        return url.replace(SOURCE.url + SOURCE.pathes.manga + "/", "");
    }
    getChapterNumber(name) {
        var _a, _b;
        return (Number((_b = (_a = name.match(/[0-9]+(\.[0-9])?/g)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.replace(/(\_|\-)/g, ".")) || 0);
    }
    getChapterSlug(source, url) {
        const SOURCE = SOURCES[source];
        return url.replace(SOURCE.url + "/", "");
    }
    async get(options) {
        const req = await gotInstance.get(Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({}, options.headers), { "user-agent": UA, cookie: cookies }) }));
        if (!req.body.includes("You are being redirected..."))
            return req;
        let cookie = this.solveSucuri(req.body);
        cookies = cookie;
        return await gotInstance.get(Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({}, options.headers), { cookie: cookie, "user-agent": UA }) }));
    }
    solveSucuri(str) {
        let scriptStart = str.indexOf("<script>") + 8, scriptEnd = str.indexOf("</script>");
        let scriptBody = str.substring(scriptStart, scriptEnd);
        let injectedScriptBody = scriptBody.replace("r=''", `r="const document = {}, location = { reload: () => exports.document = document };"`);
        let result = (0, eval_1.default)(injectedScriptBody, true);
        let cookie = result.document.cookie.replace("path=/;max-age=86400", "");
        return cookie;
    }
};
MangaReaderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MangaReaderService);
exports.MangaReaderService = MangaReaderService;
//# sourceMappingURL=manga-reader.service.js.map