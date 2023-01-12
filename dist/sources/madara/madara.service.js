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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MadaraService = void 0;
const common_1 = require("@nestjs/common");
const got_scraping_1 = require("got-scraping");
const slim_1 = require("cheerio/lib/slim");
const eval_1 = __importDefault(require("eval"));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";
let cookies = "";
const gotInstance = got_scraping_1.gotScraping.extend({
    cache: true,
    cacheOptions: {
        shared: true,
    },
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
            coverAttr: "src",
            url: "div.post-title.font-title > h3 > a",
            score: "div.numscore",
            latestChapterName: "div.adds > div.epxs",
        },
        manga: {
            title: "div.post-title > h1",
            altTitles: "div.post-content > div:nth-child(4) > div.summary-content",
            cover: "div.summary_image > a > img",
            coverAttr: "src",
            status: "div.post-status > div:nth-child(2) > div.summary-content",
            type: "div.post-content > div:nth-child(8) > div.summary-content",
            author: "div.post-content > div:nth-child(5) > div.summary-content > div > a",
            artist: `div.post-content > div:nth-child(6) > div.summary-content > div > a`,
            releasedAt: "",
            synopsis: `div.description-summary`,
            score: `div.post-content > div.post-rating > div.post-total-rating > span`,
            genre: "div.summary-content > div.genres-content > a",
            chapter: {
                list: "div.page-content-listing.single-page > div > ul > li",
                url: "a",
                number: "a",
                name: "a",
            },
        },
        chapter: {
            name: "#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li.active",
        },
    },
};
const SOURCES = {
    MANGALEK: Object.assign({ url: "https://mangalek.com" }, DEFAULT_SOURCE_SETTINGS),
    AZORA: Object.assign(Object.assign({ url: "https://azoraworlds.net" }, DEFAULT_SOURCE_SETTINGS), { pathes: {
            manga: "/series",
        } }),
    MANGASPARK: Object.assign({ url: "https://mangaspark.com" }, DEFAULT_SOURCE_SETTINGS),
    STKISSMANGA: Object.assign(Object.assign({ url: "https://1stkissmanga.io" }, DEFAULT_SOURCE_SETTINGS), { selectors: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.selectors), { manga: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.selectors.manga), { coverAttr: "data-lazy-src" }), mangaList: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.selectors.mangaList), { coverAttr: "data-lazy-src" }) }) }),
    MANGAPROTM: Object.assign(Object.assign({ url: "https://mangaprotm.com" }, DEFAULT_SOURCE_SETTINGS), { pathes: {
            manga: "/series",
        } }),
    ASHQ: Object.assign(Object.assign({ url: "https://3asq.org" }, DEFAULT_SOURCE_SETTINGS), { selectors: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.selectors), { mangaList: Object.assign(Object.assign({}, DEFAULT_SOURCE_SETTINGS.selectors.mangaList), { url: "div.item-thumb.hover-details.c-image-hover > a" }) }) }),
};
let MadaraService = class MadaraService {
    constructor() { }
    async search(source, query) {
        const SOURCE = SOURCES[source];
        try {
            const { body } = await (0, got_scraping_1.gotScraping)(SOURCE.url + `/wp-admin/admin-ajax.php`, {
                method: "POST",
                headers: {
                    "x-requested-with": "XMLHttpRequest",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: "action=wp-manga-search-manga&title=" +
                    encodeURIComponent(query),
                timeout: { response: 5 * 1000 },
            });
            const all = JSON.parse(body).data;
            return all
                .map((e) => {
                if (e.error)
                    return null;
                const slug = this.getMangaSlug(source, e.url);
                let manga = {
                    slug,
                    url: e.url,
                    title: e.title,
                    cover: this.genereateImageUrl(e.post_image || "", SOURCE.url),
                    altTitles: [],
                    genres: [],
                    score: 0,
                    chapters: [],
                    source: source,
                };
                return manga;
            })
                .filter((x) => x);
        }
        catch (err) {
            console.log(source, err);
            return [];
        }
    }
    async mangaList(source, page = 1) {
        const SOURCE = SOURCES[source];
        const results = [];
        const url = SOURCE.url + SOURCE.pathes.manga + "/page/" + page;
        const { body, ok, statusCode, statusMessage } = await this.get({
            url,
        });
        if (ok) {
            const $ = (0, slim_1.load)(body);
            $(`div.tab-content-wrap > div > div > div.page-listing-item > div > div`).each((i, el) => {
                var _a, _b, _c, _d, _e;
                const $$ = (0, slim_1.load)(el);
                const a = $$(SOURCE.selectors.mangaList.url);
                const title = ((_a = $$(`h3 > a:nth-child(2)`).text()) === null || _a === void 0 ? void 0 : _a.trim()) ||
                    ((_b = $$(`h3 > a`).text()) === null || _b === void 0 ? void 0 : _b.trim());
                if (title.includes("Novel"))
                    return;
                const url = a.attr("href");
                const slug = this.getMangaSlug(source, url);
                const chapterName = (_c = $$(`div.list-chapter > div:nth-child(1) > span.chapter.font-meta > a`)
                    .text()) === null || _c === void 0 ? void 0 : _c.trim();
                const chapterNumber = this.getChapterNumber(chapterName);
                results.push({
                    slug,
                    url,
                    title,
                    cover: this.genereateImageUrl($$(`a > img`).attr(SOURCE.selectors.mangaList.coverAttr), SOURCE.url),
                    altTitles: [],
                    genres: [],
                    score: (_e = Number((_d = $$(`div.numscore`).text()) === null || _d === void 0 ? void 0 : _d.trim())) !== null && _e !== void 0 ? _e : 0,
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
            throw new common_1.UnprocessableEntityException(statusCode, statusMessage);
        }
        return results;
    }
    async manga(source, slug) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const SOURCE = SOURCES[source];
        const mangaSelectors = SOURCE.selectors.manga;
        const url = SOURCE.url + SOURCE.pathes.manga + `/${slug}`;
        const { body, ok } = await this.get({
            url,
        });
        if (ok) {
            const $ = (0, slim_1.load)(body);
            const postID = $(`div.post-rating > input`).attr("value");
            let mangaInfo = {
                slug,
                url,
                title: (_a = $(mangaSelectors.title).text()) === null || _a === void 0 ? void 0 : _a.trim(),
                altTitles: ((_c = (_b = $(mangaSelectors.altTitles)
                    .text()) === null || _b === void 0 ? void 0 : _b.split(/(\,|\|) ?/g).filter((title) => title.length > 1)) === null || _c === void 0 ? void 0 : _c.map((x) => x.trim())) || [],
                cover: this.genereateImageUrl($(mangaSelectors.cover).attr(mangaSelectors.coverAttr), SOURCE.url),
                status: (_d = $(mangaSelectors.status).text()) === null || _d === void 0 ? void 0 : _d.trim(),
                type: (_e = $(mangaSelectors.type).text()) === null || _e === void 0 ? void 0 : _e.trim(),
                author: (_f = $(mangaSelectors.author).text()) === null || _f === void 0 ? void 0 : _f.trim(),
                artist: (_g = $(mangaSelectors.artist).text()) === null || _g === void 0 ? void 0 : _g.trim(),
                releaseYear: new Date().getFullYear(),
                synopsis: (_h = $(mangaSelectors.synopsis).text()) === null || _h === void 0 ? void 0 : _h.trim(),
                score: Number((_j = $(mangaSelectors.score).text()) === null || _j === void 0 ? void 0 : _j.trim()) * 2,
                genres: [],
                chapters: [],
                source: source,
            };
            $(mangaSelectors.genre).each((i, el) => {
                var _a;
                const $$ = (0, slim_1.load)(el);
                mangaInfo.genres.push((_a = $$("a").text()) === null || _a === void 0 ? void 0 : _a.trim());
            });
            const loadChapters = ($s) => {
                $s(mangaSelectors.chapter.list).each((i, el) => {
                    var _a, _b;
                    const $$ = (0, slim_1.load)(el);
                    const url = $$(mangaSelectors.chapter.url).attr("href") || "d";
                    const name = (_a = $$(mangaSelectors.chapter.name).text()) === null || _a === void 0 ? void 0 : _a.trim();
                    mangaInfo.chapters.push({
                        slug: (_b = this.getChapterSlug(source, url)) === null || _b === void 0 ? void 0 : _b.trim(),
                        url,
                        mangaSlug: slug === null || slug === void 0 ? void 0 : slug.trim(),
                        name: name === null || name === void 0 ? void 0 : name.trim(),
                        number: Number($$(mangaSelectors.chapter.number).attr("data-num")) || this.getChapterNumber(name === null || name === void 0 ? void 0 : name.trim()),
                        source: source,
                    });
                });
            };
            loadChapters($);
            if (mangaInfo.chapters.length <= 0) {
                const { body: chaptersBody } = await (0, got_scraping_1.gotScraping)(`${SOURCE.url}/wp-admin/admin-ajax.php`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    body: `action=manga_get_chapters&manga=${postID}`,
                });
                const chapter$ = (0, slim_1.load)(chaptersBody);
                loadChapters(chapter$);
            }
            if (mangaInfo.chapters.length <= 0) {
                console.log("hey?>?>!!");
                const { body: chaptersBody } = await (0, got_scraping_1.gotScraping)(`${SOURCE.url}${SOURCE.pathes.manga}/${mangaInfo.slug}/ajax/chapters/`.replace("//", "/"), {
                    method: "POST",
                });
                const chapter$ = (0, slim_1.load)(chaptersBody);
                loadChapters(chapter$);
            }
            return mangaInfo;
        }
    }
    async chapter(source, slug) {
        var _a;
        const SOURCE = SOURCES[source];
        const url = SOURCE.url + `/${slug}`;
        const { body, ok } = await this.get({
            url,
        });
        if (ok) {
            const $ = (0, slim_1.load)(body);
            const name = (_a = $(`#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li.active`)
                .text()) === null || _a === void 0 ? void 0 : _a.trim();
            const mangaUrl = $(`#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li:nth-child(2) > a`).attr("href");
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
            chapter.prevSlug = this.getChapterSlug(source, $(`div.nav-previous > a`).attr("href"));
            chapter.nextSlug = this.getChapterSlug(source, $(`div.nav-next > a`).attr("href"));
            $(`div.reading-content > div.page-break.no-gaps`).each((i, el) => {
                var _a;
                const $$ = (0, slim_1.load)(el);
                chapter.pages.push(this.genereateImageUrl((_a = $$(`img`).attr("src")) === null || _a === void 0 ? void 0 : _a.trim(), SOURCE.url));
            });
            return chapter;
        }
        else {
        }
    }
    genereateImageUrl(url, referer) {
        return `https://workers.emanga.tk/fetch?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}`;
    }
    async getSoruceGenres(source) {
        const SOURCE = SOURCES[source];
        const { body, ok } = await this.get({
            url: SOURCE.url + SOURCE.pathes.manga,
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
        return url === null || url === void 0 ? void 0 : url.replace(SOURCE.url + SOURCE.pathes.manga + "/", "");
    }
    getChapterNumber(name) {
        var _a, _b;
        return (Number((_b = (_a = name === null || name === void 0 ? void 0 : name.match(/[0-9]+(\.[0-9])?/g)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.replace(/(\_|\-)/g, ".")) || 0);
    }
    getChapterSlug(source, url) {
        const SOURCE = SOURCES[source];
        return url === null || url === void 0 ? void 0 : url.replace(SOURCE.url + "/", "");
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
MadaraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MadaraService);
exports.MadaraService = MadaraService;
//# sourceMappingURL=madara.service.js.map