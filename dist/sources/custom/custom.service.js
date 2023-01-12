"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSourceService = void 0;
const common_1 = require("@nestjs/common");
const got_scraping_1 = require("got-scraping");
const slim_1 = require("cheerio/lib/slim");
const manga_input_1 = require("../..//manga/dto/manga.input");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";
const TEAMX = {
    source: manga_input_1.Sources.TEAMX,
    url: "https://team1x1.fun",
    pathes: { manga: "/series" },
    config: {
        scoreMultiplyBy: 1,
    },
    selectors: {
        manga: {
            title: "div.author-info-title > h1",
            altTitles: "",
            cover: "div.whitebox.shadow-sm > div.text-right > img",
            status: "div.whitebox.shadow-sm > div.text-right > div:nth-child(6) > small:nth-child(2) > a",
            type: "div.whitebox.shadow-sm > div.text-right > div:nth-child(5) > small:nth-child(2) > a",
            author: "",
            artist: "div.whitebox.shadow-sm > div.text-right > div:nth-child(7) > small:nth-child(2) > a",
            releasedAt: "",
            synopsis: `div.whitebox.shadow-sm > div.review-content > p`,
            score: ``,
            genre: "div.whitebox.shadow-sm > div.review-author-info > a",
            chapter: {
                list: "#chapter-contact > div.ts-chl-collapsible-content > div > ul > li",
                url: "a",
                number: "a > div:nth-child(2)",
                name: "a > div:nth-child(3)",
                lastChaptersPage: `--`,
                pageSize: 98,
            },
        },
        mangaList: {
            list: "div.listupd > div.bs",
            dropdown: {
                genre: "",
            },
            title: "div > a > div.bigor > div",
            cover: "div > a > div.limit > img",
            url: "a",
            score: "",
            latestChapterName: "",
        },
        chapter: {
            name: "#chapter-heading",
            number: `#select_chapter > option[selected="true"]`,
            next: "#next-chapter",
            prev: "#prev-chapter",
            page: "div.reading-content > div.image_list > div > img",
            mangaUrl: `#manga-reading-nav-head > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div > div:nth-child(4) > a`,
        },
    },
    utils: {
        getMangaSlug(url) {
            var _a;
            return (_a = url === null || url === void 0 ? void 0 : url.replace(this.url, "")) === null || _a === void 0 ? void 0 : _a.replace(this.pathes.manga, "");
        },
        getChapterSlug(url) {
            var _a;
            return (_a = url === null || url === void 0 ? void 0 : url.replace(this.url, "")) === null || _a === void 0 ? void 0 : _a.replace(this.pathes.manga, "");
        },
        async getSearchData(query, sourceData) {
            try {
                const results = [];
                const url = `https://mnhaestate.com/ajax/search?keyword=${encodeURIComponent(query)}`;
                const { body } = await (0, got_scraping_1.gotScraping)(url, {
                    method: "GET",
                    timeout: { response: 5 * 1000 },
                });
                const $ = (0, slim_1.load)(body);
                $(`ol > li`).each((i, el) => {
                    var _a;
                    const $$ = (0, slim_1.load)(el);
                    const url = $$(`a`).attr("href");
                    results.push({
                        url,
                        slug: this.utils.getMangaSlug.bind(sourceData)(url),
                        title: (_a = $$(`a`).text()) === null || _a === void 0 ? void 0 : _a.trim(),
                        cover: `https://workers.emanga.tk/fetch?url=${encodeURIComponent($$("a > img").attr("src"))}&referer=${encodeURIComponent(url)}`,
                        altTitles: [],
                        genres: [],
                        source: sourceData.source,
                    });
                });
                return results;
            }
            catch (_a) {
                return [];
            }
        },
        getMangaUrl(slug, page = 1) {
            return clearDupleSlashes(this.url + this.pathes.manga + `/` + slug + `?page=${page}`);
        },
        getMangaListUrl(page = 1) {
            return clearDupleSlashes(this.url + this.pathes.manga + `/?page=${page}`);
        },
        getChapterUrl(slug) {
            return clearDupleSlashes(this.url + this.pathes.manga + `/` + slug);
        },
    },
};
const KISSMANGA = {
    source: manga_input_1.Sources.KISSMANGA,
    config: {
        scoreMultiplyBy: 1,
    },
    url: "https://kissmanga.org",
    pathes: { manga: "/manga", mangaList: "/manga_list", chapter: "/chapter" },
    selectors: {
        manga: {
            title: "#leftside > div:nth-child(1) > div.barContent.full > div.full > h2 > strong",
            altTitles: "#leftside > div:nth-child(1) > div.barContent.full > div.full > p:nth-child(2) > a",
            cover: "#rightside > div > div.barContent.cover_anime.full > div.a_center > img",
            status: "#leftside > div:nth-child(1) > div.barContent.full > div.full > div.static_single > p:nth-child(1)",
            type: "div.whitebox.shadow-sm > div.text-right > div:nth-child(5) > small:nth-child(2) > a",
            author: "#leftside > div:nth-child(1) > div.barContent.full > div.full > p:nth-child(3) > a",
            artist: "div.whitebox.shadow-sm > div.text-right > div:nth-child(7) > small:nth-child(2) > a",
            releasedAt: "",
            synopsis: `#leftside > div:nth-child(1) > div.barContent.full > div.full > div.summary > p`,
            score: ``,
            genre: "#leftside > div:nth-child(1) > div.barContent.full > div.full > p:nth-child(4) > a",
            chapter: {
                list: "#leftside > div:nth-child(3) > div.barContent.episodeList.full > div.full > div.listing.listing8515.full > div > div:nth-child(1) > h3 > a",
                url: "a",
                number: "a",
                name: "a",
            },
        },
        mangaList: {
            list: "#leftside > div:nth-child(2) > div.barContent.full > div.listing.full > div > div > a.item_movies_link",
            dropdown: {
                genre: "",
            },
            title: "a",
            cover: "",
            url: "a",
            score: "",
            latestChapterName: "",
        },
        chapter: {
            name: "#selectEpisode > option[selected]",
            number: `#selectEpisode > option[selected]`,
            next: "div.btn_next_and_prev > a.nexxt",
            prev: "div.btn_next_and_prev > a.preev",
            page: "#centerDivVideo > img",
            mangaUrl: ``,
        },
    },
    utils: {
        getMangaSlug(url) {
            var _a;
            return (_a = url === null || url === void 0 ? void 0 : url.replace(this.url, "")) === null || _a === void 0 ? void 0 : _a.replace(this.pathes.manga, "");
        },
        getChapterSlug(url) {
            var _a;
            return (_a = url === null || url === void 0 ? void 0 : url.replace(this.url, "")) === null || _a === void 0 ? void 0 : _a.replace(this.pathes.chapter, "");
        },
        async getSearchData(query, sourceData) {
            const results = [];
            try {
                const url = `https://kissmanga.org/Search/SearchSuggest?keyword=${encodeURIComponent(query)}`;
                const { body } = await (0, got_scraping_1.gotScraping)(url, {
                    method: "GET",
                    timeout: { response: 5 * 1000 },
                });
                const $ = (0, slim_1.load)(body);
                $(`a.item_search_link`).each((i, el) => {
                    var _a;
                    const $$ = (0, slim_1.load)(el);
                    const url = sourceData.url + $$(`a`).attr("href");
                    const slug = this.utils.getMangaSlug.bind(sourceData)(url);
                    results.push({
                        url,
                        slug: slug,
                        title: (_a = $$(`a`).text()) === null || _a === void 0 ? void 0 : _a.trim(),
                        cover: `https://workers.emanga.tk/fetch?url=${encodeURIComponent(`https://kissmanga.org/mangaimage/${slug}.jpg`)}&referer=${encodeURIComponent(url)}`,
                        altTitles: [],
                        genres: [],
                        source: sourceData.source,
                    });
                });
                return results;
            }
            catch (_a) {
                return results;
            }
        },
        getMangaCover(slug) {
            return clearDupleSlashes(`https://kissmanga.org/mangaimage${(slug === null || slug === void 0 ? void 0 : slug.startsWith("/")) ? slug : "/" + slug}.jpg`);
        },
        getMangaUrl(slug, page = 1) {
            return clearDupleSlashes(this.url + this.pathes.manga + `/` + slug + `?page=${page}`);
        },
        getMangaListUrl(page = 1) {
            return clearDupleSlashes(this.url + this.pathes.mangaList + `/?page=${page}`);
        },
        getChapterUrl(slug) {
            return clearDupleSlashes(this.url + this.pathes.chapter + `/` + slug);
        },
    },
};
const mangakalotUrls = [
    { url: "https://readmanganato.com", urlSlug: "readmanganato" },
    { url: "https://manganato.com", urlSlug: "manganato" },
    { url: "https://chapmanganato.com", urlSlug: "chapmanganato" },
    { url: "https://mangakakalot.com", urlSlug: "mangakakalot" },
];
const MANGAKAKALOT = {
    url: "https://manganato.com",
    pathes: {
        mangaList: "/genre-all",
        manga: "/",
    },
    config: {
        scoreMultiplyBy: 2,
    },
    selectors: {
        mangaList: {
            list: "div.panel-content-genres > div.content-genres-item",
            url: "a",
            cover: "a > img",
            score: "a > em.genres-item-rate",
            title: "div > h3 > a",
            latestChapterName: "div > a.genres-item-chap.text-nowrap.a-h",
            dropdown: { genre: "" },
        },
        manga: {
            title: "div.panel-story-info > div.story-info-right > h1",
            altTitles: "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(1) > td.table-value > h2",
            artist: "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(2) > td.table-value > a",
            author: "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(2) > td.table-value > a",
            cover: "div.panel-story-info > div.story-info-left > span.info-image > img",
            genre: "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(4) > td.table-value > a",
            releasedAt: "",
            score: "#rate_row_cmd > em > em:nth-child(2) > em > em:nth-child(1)",
            status: "div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(3) > td.table-value",
            synopsis: "#panel-story-info-description",
            type: "",
            chapter: {
                list: "div.container.container-main > div.container-main-left > div.panel-story-chapter-list > ul > li > a",
                name: "a",
                number: "a",
                url: "a",
            },
        },
        chapter: {
            page: "div.container-chapter-reader > img",
            mangaUrl: "body > div.body-site > div:nth-child(1) > div.panel-breadcrumb > a:nth-child(3)",
            name: "body > div.body-site > div:nth-child(1) > div.panel-breadcrumb > a:nth-child(5)",
            next: "a.navi-change-chapter-btn-next.a-h",
            prev: "a.navi-change-chapter-btn-prev.a-h",
            number: "body > div.body-site > div:nth-child(1) > div.panel-breadcrumb > a:nth-child(5)",
        },
    },
    utils: {
        getMangaSlug(url) {
            let urlSlug = "mangakakalot";
            let replacedUrl = url === null || url === void 0 ? void 0 : url.replace(this.url, "");
            mangakalotUrls.map((data) => {
                if (url === null || url === void 0 ? void 0 : url.includes(data.urlSlug))
                    urlSlug = data.urlSlug;
                replacedUrl = replacedUrl === null || replacedUrl === void 0 ? void 0 : replacedUrl.replace(data.url, "");
            });
            return urlSlug + "[]" + (replacedUrl === null || replacedUrl === void 0 ? void 0 : replacedUrl.replace(this.pathes.manga, ""));
        },
        getChapterSlug(url) {
            let urlSlug = "mangakakalot";
            let replacedUrl = url === null || url === void 0 ? void 0 : url.replace(this.url, "");
            mangakalotUrls.map((data) => {
                if (url === null || url === void 0 ? void 0 : url.includes(data.urlSlug))
                    urlSlug = data.urlSlug;
                replacedUrl = replacedUrl === null || replacedUrl === void 0 ? void 0 : replacedUrl.replace(data.url, "");
            });
            return (urlSlug + "[]" + (replacedUrl === null || replacedUrl === void 0 ? void 0 : replacedUrl.replace(this.pathes.chapter, "")));
        },
        async getSearchData(query, sourceData) {
            try {
                const url = `https://manganato.com/getstorysearchjson`;
                const { body } = await (0, got_scraping_1.gotScraping)(url, {
                    method: "POST",
                    dnsCache: true,
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    body: `searchword=${query.replace(/ /g, "_")}`,
                    timeout: { response: 10 * 1000 },
                });
                const { searchlist } = JSON.parse(body);
                const results = searchlist.map((manga) => {
                    const mangaFormatted = {
                        url: manga.url_story,
                        altTitles: [],
                        cover: `https://workers.emanga.tk/fetch?url=${encodeURIComponent(manga.image)}&referer=${encodeURIComponent(manga.url_story)}`,
                        genres: [],
                        slug: this.utils.getMangaSlug.bind(sourceData)(manga.url_story),
                        source: manga_input_1.Sources.MANGAKAKALOT,
                        title: (0, slim_1.load)(manga.name).text(),
                    };
                    return mangaFormatted;
                });
                return results;
            }
            catch (_a) {
                return [];
            }
        },
        getMangaUrl(slug, page = 1) {
            const [urlSlug, mangaSlug] = slug.split("[]");
            const urlData = mangakalotUrls.find((url) => url.urlSlug === urlSlug);
            return clearDupleSlashes(urlData.url + `/` + mangaSlug);
        },
        getMangaListUrl(page = 1, order) {
            return clearDupleSlashes(`https://manganato.com/genre-all` + `/${page}?type=${order === "top" ? "topview" : order === "new" ? "newest" : ""}`);
        },
        getChapterUrl(slug) {
            const [urlSlug, chapterSlug] = slug.split("[]");
            const urlData = mangakalotUrls.find((url) => url.urlSlug === urlSlug);
            return clearDupleSlashes(urlData.url + `/` + chapterSlug);
        },
    },
    source: manga_input_1.Sources.MANGAKAKALOT,
};
const customSources = {
    TEAMX,
    KISSMANGA,
    MANGAKAKALOT,
};
let CustomSourceService = class CustomSourceService {
    async search(source, query) {
        try {
            const sourceData = customSources[source];
            const data = await sourceData.utils.getSearchData.bind(sourceData)(query, sourceData);
            return data;
        }
        catch (_a) {
            return [];
        }
    }
    async mangaList(source, page = 0, order) {
        const result = [];
        const sourceData = customSources[source];
        const url = sourceData.utils.getMangaListUrl.bind(sourceData)(page, order);
        const { body } = await (0, got_scraping_1.gotScraping)(url, {
            cache: true,
            dnsCache: true,
        });
        const $ = (0, slim_1.load)(body);
        $(sourceData.selectors.mangaList.list).each((i, el) => {
            var _a;
            const $$ = (0, slim_1.load)(el);
            const url = $$(sourceData.selectors.mangaList.url).attr("href");
            const slug = sourceData.utils.getMangaSlug.bind(sourceData)(url);
            const manga = {
                url,
                slug,
                title: $$(sourceData.selectors.mangaList.title).text().trim(),
                cover: this.genereateImageUrl(sourceData.utils.getMangaCover
                    ? sourceData.utils.getMangaCover(slug)
                    : $$(sourceData.selectors.mangaList.cover).attr("src"), url),
                altTitles: [],
                genres: [],
                source: sourceData.source,
                score: Number((_a = $$(sourceData.selectors.mangaList.score).text()) === null || _a === void 0 ? void 0 : _a.trim()) * sourceData.config.scoreMultiplyBy,
                chapters: [
                    {
                        name: $$(sourceData.selectors.mangaList.latestChapterName).text(),
                        number: this.getChapterNumber($$(sourceData.selectors.mangaList
                            .latestChapterName).text()),
                    },
                ],
            };
            result.push(manga);
        });
        return result;
    }
    async manga(source, slug) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const getChapterNumber = this.getChapterNumber;
        const sourceData = customSources[source];
        const url = sourceData.utils.getMangaUrl.bind(sourceData)(slug);
        const { body } = await (0, got_scraping_1.gotScraping)(url, {
            cache: true,
            dnsCache: true,
        });
        const $ = (0, slim_1.load)(body);
        const mangaDetails = {
            url,
            slug,
            title: (_a = $(sourceData.selectors.manga.title).text()) === null || _a === void 0 ? void 0 : _a.trim(),
            cover: this.genereateImageUrl(sourceData.utils.getMangaCover
                ? sourceData.utils.getMangaCover(slug)
                : $(sourceData.selectors.manga.cover).attr("src"), url),
            source: manga_input_1.Sources[source],
            author: (_b = $(sourceData.selectors.manga.author).text()) === null || _b === void 0 ? void 0 : _b.trim(),
            artist: (_c = $(sourceData.selectors.manga.artist).text()) === null || _c === void 0 ? void 0 : _c.trim(),
            synopsis: (_d = $(sourceData.selectors.manga.synopsis).text()) === null || _d === void 0 ? void 0 : _d.trim(),
            releaseYear: Number((_e = $(sourceData.selectors.manga.releasedAt).text()) === null || _e === void 0 ? void 0 : _e.trim()),
            score: Number((_f = $(sourceData.selectors.manga.score).text()) === null || _f === void 0 ? void 0 : _f.trim()) *
                sourceData.config.scoreMultiplyBy,
            status: (_g = $(sourceData.selectors.manga.status).text()) === null || _g === void 0 ? void 0 : _g.trim(),
            type: (_h = $(sourceData.selectors.manga.type).text()) === null || _h === void 0 ? void 0 : _h.trim(),
            altTitles: [],
            genres: [],
            chapters: [],
        };
        $(sourceData.selectors.manga.genre).each((i, el) => {
            var _a, _b, _c;
            const $$ = (0, slim_1.load)(el);
            mangaDetails.genres.push((_c = (_b = (_a = $$(el)
                .text()) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.split(" ")) === null || _c === void 0 ? void 0 : _c.map((x) => x.trim()).join(" "));
        });
        getChapters($);
        if (sourceData.selectors.manga.chapter.lastChaptersPage &&
            mangaDetails.chapters.length >
                sourceData.selectors.manga.chapter.pageSize) {
            let lastCount = mangaDetails.chapters.length;
            let page = 1;
            do {
                lastCount = mangaDetails.chapters.length;
                const url = sourceData.utils.getMangaUrl.bind(sourceData)(slug, page);
                const { body } = await (0, got_scraping_1.gotScraping)(url, {
                    cache: true,
                    dnsCache: true,
                });
                const $$$ = (0, slim_1.load)(body);
                getChapters($$$);
                page++;
            } while (mangaDetails.chapters.length > lastCount);
        }
        return mangaDetails;
        function getChapters($) {
            $(sourceData.selectors.manga.chapter.list).each((i, el) => {
                var _a, _b, _c, _d;
                const $$ = (0, slim_1.load)(el);
                const url = $$(sourceData.selectors.manga.chapter.url).attr("href");
                mangaDetails.chapters.push({
                    slug: sourceData.utils.getChapterSlug.bind(sourceData)(url),
                    name: (_c = (_b = (_a = $$(sourceData.selectors.manga.chapter.name)
                        .text()) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.split(" ")) === null || _c === void 0 ? void 0 : _c.map((x) => x.trim()).join(" "),
                    number: getChapterNumber((_d = $$(sourceData.selectors.manga.chapter.number)
                        .text()) === null || _d === void 0 ? void 0 : _d.trim()),
                    mangaSlug: mangaDetails.slug,
                    url,
                    source: manga_input_1.Sources[source],
                });
            });
        }
    }
    async chapter(source, slug) {
        var _a, _b;
        const sourceData = customSources[source];
        const url = sourceData.utils.getChapterUrl.bind(sourceData)(slug);
        const { body } = await (0, got_scraping_1.gotScraping)(url, {
            cache: true,
            dnsCache: true,
        });
        const $ = (0, slim_1.load)(body);
        const nextChapterUrl = $(sourceData.selectors.chapter.next).attr("href");
        const prevChapterUrl = $(sourceData.selectors.chapter.prev).attr("href");
        const chapterData = {
            url,
            slug,
            name: (_a = $(sourceData.selectors.chapter.name).text()) === null || _a === void 0 ? void 0 : _a.trim(),
            number: this.getChapterNumber((_b = $(sourceData.selectors.chapter.number).text()) === null || _b === void 0 ? void 0 : _b.trim()),
            mangaSlug: sourceData.utils.getMangaSlug.bind(sourceData)($(sourceData.selectors.chapter.mangaUrl).attr("href")),
            nextSlug: nextChapterUrl &&
                sourceData.utils.getChapterSlug.bind(sourceData)(nextChapterUrl),
            prevSlug: prevChapterUrl &&
                sourceData.utils.getChapterSlug.bind(sourceData)(prevChapterUrl),
            pages: [],
            source: sourceData.source,
        };
        $(sourceData.selectors.chapter.page).each((i, el) => {
            const $$ = (0, slim_1.load)(el);
            chapterData.pages.push(this.genereateImageUrl($$(el).attr("src"), url));
        });
        return chapterData;
    }
    getChapterNumber(name) {
        var _a, _b;
        return (Number((_b = (_a = name.match(/[0-9]+(\.[0-9])?/g)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.replace(/(\_|\-)/g, ".")) || 0);
    }
    genereateImageUrl(url, referer) {
        return `https://workers.emanga.tk/fetch?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}`;
    }
};
CustomSourceService = __decorate([
    (0, common_1.Injectable)()
], CustomSourceService);
exports.CustomSourceService = CustomSourceService;
function clearDupleSlashes(string) {
    return ("https://" +
        string
            .replace("https://", "")
            .replace("http://", "")
            .replace(/\/\//g, "/"));
}
//# sourceMappingURL=custom.service.js.map