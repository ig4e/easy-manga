import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { gotScraping, OptionsOfTextResponseBody } from "got-scraping";
import { load } from "cheerio/lib/slim";
import * as urlHandle from "url-query-handle";
import { Manga } from "src/manga/entities/manga.entity";
import { Chapter } from "src/chapters/entities/chapter.entity";
import _eval from "eval";
import { MangaListFilters } from "src/manga/dto/manga.input";
import { Genre } from "src/genres/entities/genre.entity";
const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";
let cookies = "";

const gotInstance = gotScraping.extend({
    cache: true,
    cacheOptions: {
        shared: true,
    },
    dnsCache: true,
});

const DEFAULT_SOURCE_SETTINGS: SourceSettings = {
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

const SOURCES: SourcesSettings = {
    ARENASCANS: {
        url: "https://arenascans.net",
        ...DEFAULT_SOURCE_SETTINGS,
    },
    ARES: {
        url: "https://aresmanga.net",
        ...DEFAULT_SOURCE_SETTINGS,
        pathes: { ...DEFAULT_SOURCE_SETTINGS.pathes, manga: "/series" },
    },
    OZULSCANS: {
        url: "https://ozulscans.com",
        ...DEFAULT_SOURCE_SETTINGS,
    },
    GALAXYMANGA: {
        url: "https://galaxymanga.org",
        ...DEFAULT_SOURCE_SETTINGS,
        selectors: {
            ...DEFAULT_SOURCE_SETTINGS.selectors,
            manga: {
                ...DEFAULT_SOURCE_SETTINGS.selectors.manga,
                synopsis: `div.entry-content.entry-content-single > blockquote > p`,
            },
        },
    },
    MANGASWAT: {
        url: "https://swatmanga.me",
        pathes: { ...DEFAULT_SOURCE_SETTINGS.pathes, manga: "/manga" },
        selectors: {
            ...DEFAULT_SOURCE_SETTINGS.selectors,
            manga: {
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
            },
        },
    },
};

export type MangaReaderSources =
    | "ARES"
    | "GALAXYMANGA"
    | "MANGASWAT"
    | "OZULSCANS"
    | "ARENASCANS";

@Injectable()
export class MangaReaderService {
    constructor() {}
    async search(source: MangaReaderSources, query: string): Promise<Manga[]> {
        try {
            const SOURCE = SOURCES[source];
            const { body }: { body: any } = await gotInstance.post(
                SOURCE.url + `/wp-admin/admin-ajax.php`,
                {
                    headers: {
                        "x-requested-with": "XMLHttpRequest",
                        "content-type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    body:
                        "action=ts_ac_do_search&ts_ac_query=" +
                        encodeURIComponent(query),
                    timeout: { response: 5 * 1000 },
                },
            );
            const all = JSON.parse(body).series[0].all;

            return all
                .map((e) => {
                    const slug = this.getMangaSlug(source, e.post_link);
                    let manga: Manga = {
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
                                source: source as any,
                            },
                        ],
                        source: source as any,
                    };
                    return manga;
                })
                .filter((x) => x);
        } catch {
            return [];
        }
    }

    async mangaList(
        source: MangaReaderSources,
        mangaListOptions: MangaListFilters = { page: 1 },
    ): Promise<Manga[]> {
        const SOURCE = SOURCES[source];
        const results: Manga[] = [];
        const url = urlHandle
            .addMultipleParams(
                SOURCE.url + SOURCE.pathes.manga,
                mangaListOptions,
            )
            .replace("genre", "genre[]");
        const { body, ok, statusCode, statusMessage } = await this.get({
            url,
            dnsCache: true,
        });

        if (ok) {
            const $ = load(body);
            $(`div.listupd > div.bs`).each((i, el) => {
                const $$ = load(el);
                const a = $$("div.bsx > a");
                const title = a.attr("title");
                if (title.includes("Novel")) return;
                const url = a.attr("href");
                const slug = this.getMangaSlug(source, url);
                const chapterName = $$(`div.adds > div.epxs`).text()?.trim();
                const chapterNumber = this.getChapterNumber(chapterName);
                results.push({
                    slug,
                    url,
                    title,
                    cover: this.genereateImageUrl(
                        $$(`img.wp-post-image`).attr("src"),
                        SOURCE.url,
                    ),
                    altTitles: [],
                    genres: [],
                    score: Number($$(`div.numscore`).text()?.trim()) ?? 0,
                    chapters: [
                        {
                            slug: "",
                            url: "",
                            mangaSlug: slug,
                            name: chapterName,
                            number: chapterNumber,
                            source: source as any,
                        },
                    ],
                    source: source as any,
                });
            });
        } else {
            console.log(ok, statusCode, url);
            throw new UnprocessableEntityException(statusCode, statusMessage);
        }

        return results;
    }

    async manga(source: MangaReaderSources, slug: string): Promise<Manga> {
        const SOURCE = SOURCES[source];
        const mangaSelectors = SOURCE.selectors.manga;
        const url = SOURCE.url + SOURCE.pathes.manga + `/${slug}`;
        const { body, ok } = await this.get({
            url,
            dnsCache: true,
        });

        if (ok) {
            const $ = load(body);

            let mangaInfo: Manga = {
                slug,
                url,
                title: $(mangaSelectors.title).text(),
                altTitles:
                    $(mangaSelectors.altTitles)
                        .text()
                        ?.split(/(\,|\|) ?/g)
                        .filter((title) => title.length > 1) || [],
                cover: this.genereateImageUrl(
                    $(mangaSelectors.cover).attr("src"),
                    SOURCE.url,
                ),
                status: $(mangaSelectors.status).text(),
                type: $(mangaSelectors.type).text(),
                author: $(mangaSelectors.author).text(),
                artist: $(mangaSelectors.artist).text(),
                releaseYear: new Date().getFullYear(),
                synopsis: $(mangaSelectors.synopsis).text(),
                score: Number($(mangaSelectors.score).text()),
                genres: [],
                chapters: [],
                source: source as any,
            };

            $(mangaSelectors.chapter.list).each((i, el) => {
                const $$ = load(el);
                const url = $$(mangaSelectors.chapter.url).attr("href");
                const name = $$(mangaSelectors.chapter.name).text()?.trim();
                mangaInfo.chapters.push({
                    slug: this.getChapterSlug(source, url),
                    url,
                    mangaSlug: slug,
                    name: name,
                    number:
                        Number(
                            $$(mangaSelectors.chapter.number).attr("data-num"),
                        ) || this.getChapterNumber(name),
                    source: source as any,
                });
            });

            $(mangaSelectors.genre).each((i, el) => {
                const $$ = load(el);
                mangaInfo.genres.push($$("a").text()?.trim());
            });

            return mangaInfo;
        }
    }

    async chapter(source: MangaReaderSources, slug: string) {
        const SOURCE = SOURCES[source];
        const url = SOURCE.url + `/${slug}`;
        const { body, ok } = await this.get({
            url,
            dnsCache: true,
        });

        if (ok) {
            const $ = load(body);
            const name = $(`div.headpost > h1.entry-title`).text();

            const mangaUrl = $(`div.headpost > div > a`).attr("href");

            const chapter: Chapter = {
                url,
                slug: this.getChapterSlug(source, url),
                mangaSlug: this.getMangaSlug(source, mangaUrl),
                name: name,
                number: this.getChapterNumber(name),
                nextSlug: "",
                prevSlug: "",
                pages: [],
                source: source as any,
            };

            let chapterData = JSON.parse(
                body
                    .match(/ts\_reader.run\({.+\}/m)[0]
                    .replace("ts_reader.run(", ""),
            );

            chapter.prevSlug = this.getChapterSlug(source, chapterData.prevUrl);
            chapter.nextSlug = this.getChapterSlug(source, chapterData.nextUrl);
            chapter.pages = chapterData.sources[0].images?.map((img) =>
                this.genereateImageUrl(img, SOURCE.url),
            );

            return chapter;
        } else {
        }
    }

    genereateImageUrl(url: string, referer: string) {
        return `https://workers.emanga.tk/fetch?url=${encodeURIComponent(
            url,
        )}&referer=${encodeURIComponent(referer)}`;
    }

    async getSoruceGenres(source: MangaReaderSources) {
        const SOURCE = SOURCES[source];
        const { body, ok } = await this.get({
            url: SOURCE.url + SOURCE.pathes.manga,
            dnsCache: true,
        });
        const genres: Genre[] = [];

        if (ok) {
            const $ = load(body);
            $(SOURCE.selectors.mangaList.dropdown.genre).each((i, el) => {
                const $$ = load(el);
                const id = $$(`input`).attr("value");
                const genre: Genre = {
                    id: Number(id),
                    name: $$(`label`).text()?.trim(),
                };
                genres.push(genre);
            });
        }

        return genres;
    }

    getMangaSlug(source: MangaReaderSources, url: string) {
        const SOURCE = SOURCES[source];
        return url.replace(SOURCE.url + SOURCE.pathes.manga + "/", "");
    }

    getChapterNumber(name: string) {
        return (
            Number(
                name.match(/[0-9]+(\.[0-9])?/g)?.[0]?.replace(/(\_|\-)/g, "."),
            ) || 0
        );
    }

    getChapterSlug(source: MangaReaderSources, url: string) {
        const SOURCE = SOURCES[source];
        return url.replace(SOURCE.url + "/", "");
    }

    async get(options: OptionsOfTextResponseBody) {
        const req = await gotInstance.get({
            ...options,
            headers: { ...options.headers, "user-agent": UA, cookie: cookies },
        });
        if (!req.body.includes("You are being redirected...")) return req;
        let cookie = this.solveSucuri(req.body);
        cookies = cookie;
        return await gotInstance.get({
            ...options,
            headers: {
                ...options.headers,
                cookie: cookie,
                "user-agent": UA,
            },
        });
    }

    solveSucuri(str: string) {
        let scriptStart = str.indexOf("<script>") + 8,
            scriptEnd = str.indexOf("</script>");
        let scriptBody = str.substring(scriptStart, scriptEnd);
        let injectedScriptBody = scriptBody.replace(
            "r=''",
            `r="const document = {}, location = { reload: () => exports.document = document };"`,
        );

        let result: any = _eval(injectedScriptBody, true);
        let cookie = result.document.cookie.replace("path=/;max-age=86400", "");

        return cookie;
    }
}

export interface SourcesSettings {
    [index: string]: SourceSettingsWithUrl;
}

interface SourceSettingsWithUrl extends SourceSettings {
    url: string;
}

export interface SourceSettings {
    pathes: {
        manga: string;
    };
    selectors: {
        mangaList: {
            list: string;
            cover: string;
            url: string;
            score: string;
            dropdown: {
                genre: string;
            };
            latestChapterName: string;
        };
        manga: {
            title: string;
            altTitles: string;
            cover: string;
            status: string;
            type: string;
            author: string;
            artist: string;
            releasedAt: string;
            synopsis: string;
            score: string;
            genre: string;
            chapter: {
                list: string;
                url: string;
                number: string;
                name: string;
            };
        };
        chapter: {
            name: string;
        };
    };
}
