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
            title: "div.post-title > h1",
            altTitles:
                "body > div.wrap > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(4) > div.summary-content",
            cover: "div.tab-summary > div.summary_image > a > img",
            status: "body > div.wrap > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div:nth-child(2) > div.summary-content",
            type: "body > div.wrap > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(8) > div.summary-content",
            author: "body > div.wrap > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(5) > div.summary-content > div > a",
            artist: `body > div.wrap > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(6) > div.summary-content > div > a`,
            releasedAt: "",
            synopsis: `#tw-target-text > span`,
            score: `body > div.wrap > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div.post-rating > div.post-total-rating > span`,
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

const SOURCES: SourcesSettings = {
    MANGALEK: {
        url: "https://mangalek.com",
        ...DEFAULT_SOURCE_SETTINGS,
    },
    AZORA: {
        url: "https://azoraworlds.net",
        ...DEFAULT_SOURCE_SETTINGS,
        pathes: {
            manga: "/series",
        },
    },
    MANGASPARK: {
        url: "https://mangaspark.com",
        ...DEFAULT_SOURCE_SETTINGS,
    },
    STKISSMANGA: {
        url: "https://1stkissmanga.love",
        ...DEFAULT_SOURCE_SETTINGS,
    },
    MANGAPROTM: {
        url: "https://mangaprotm.com",
        ...DEFAULT_SOURCE_SETTINGS,
        pathes: {
            manga: "/series",
        },
    },
};

export type MadaraSources =
    | "MANGALEK"
    | "MANGASPARK"
    | "AZORA"
    | "STKISSMANGA"
    | "MANGAPROTM";

@Injectable()
export class MadaraService {
    constructor() {}
    async search(source: MadaraSources, query: string): Promise<Manga[]> {
        const SOURCE = SOURCES[source];
        try {
            const { body }: { body: any } = await gotScraping(
                SOURCE.url + `/wp-admin/admin-ajax.php`,
                {
                    method: "POST",
                    headers: {
                        "x-requested-with": "XMLHttpRequest",
                        "content-type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    body:
                        "action=wp-manga-search-manga&title=" +
                        encodeURIComponent(query),
                },
            );

            const all = JSON.parse(body).data;

            return all
                .map((e) => {
                    if (e.error) return null;
                    const slug = this.getMangaSlug(source, e.url);
                    let manga: Manga = {
                        slug,
                        url: e.url,
                        title: e.title,
                        cover: this.genereateImageUrl(
                            e.post_image || "",
                            SOURCE.url,
                        ),
                        altTitles: [],
                        genres: [],
                        score: 0,
                        chapters: [],
                        source: source as any,
                    };
                    return manga;
                })
                .filter((x) => x);
        } catch (err) {
            console.log(source, err);

            return [];
        }
    }

    async mangaList(source: MadaraSources): Promise<Manga[]> {
        const SOURCE = SOURCES[source];
        const results: Manga[] = [];
        const url = SOURCE.url + SOURCE.pathes.manga;

        const { body, ok, statusCode, statusMessage } = await this.get({
            url,
        });

        if (ok) {
            const $ = load(body);
            $(
                `div.tab-content-wrap > div > div > div.page-listing-item > div > div`,
            ).each((i, el) => {
                const $$ = load(el);
                const a = $$("div.post-title.font-title > h3 > a");
                const title = $$(`h3 > a`).text()?.trim();
                if (title.includes("Novel")) return;
                const url = a.attr("href");
                const slug = this.getMangaSlug(source, url);
                const chapterName = $$(
                    `div.list-chapter > div:nth-child(1) > span.chapter.font-meta > a`,
                )
                    .text()
                    ?.trim();
                const chapterNumber = this.getChapterNumber(chapterName);
                results.push({
                    slug,
                    url,
                    title,
                    cover: this.genereateImageUrl(
                        $$(`a > img`).attr("src"),
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
            throw new UnprocessableEntityException(statusCode, statusMessage);
        }

        return results;
    }

    async manga(source: MadaraSources, slug: string): Promise<Manga> {
        const SOURCE = SOURCES[source];
        const mangaSelectors = SOURCE.selectors.manga;
        const url = SOURCE.url + SOURCE.pathes.manga + `/${slug}`;
        const { body, ok } = await this.get({
            url,
        });

        if (ok) {
            const $ = load(body);
            const postID = $(`div.post-rating > input`).attr("value");

            let mangaInfo: Manga = {
                slug,
                url,
                title: $(mangaSelectors.title).text()?.trim(),
                altTitles:
                    $(mangaSelectors.altTitles)
                        .text()
                        ?.split(/(\,|\|) ?/g)
                        .filter((title) => title.length > 1)
                        ?.map((x) => x.trim()) || [],
                cover: this.genereateImageUrl(
                    $(mangaSelectors.cover).attr("src"),
                    SOURCE.url,
                ),
                status: $(mangaSelectors.status).text()?.trim(),
                type: $(mangaSelectors.type).text()?.trim(),
                author: $(mangaSelectors.author).text()?.trim(),
                artist: $(mangaSelectors.artist).text()?.trim(),
                releaseYear: new Date().getFullYear(),
                synopsis: $(mangaSelectors.synopsis).text()?.trim(),
                score: Number($(mangaSelectors.score).text()?.trim()) * 2,
                genres: [],
                chapters: [],
                source: source as any,
            };

            $(mangaSelectors.genre).each((i, el) => {
                const $$ = load(el);
                mangaInfo.genres.push($$("a").text()?.trim());
            });

            const { body: chaptersBody } = await gotScraping(
                `${SOURCE.url}/wp-admin/admin-ajax.php`,
                {
                    method: "POST",
                    headers: {
                        "content-type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    body: `action=manga_get_chapters&manga=${postID}`,
                },
            );

            const chapter$ = load(chaptersBody);

            chapter$(mangaSelectors.chapter.list).each((i, el) => {
                const $$ = load(el);
                const url = $$(mangaSelectors.chapter.url).attr("href") || "d";

                console.log(url);
                const name = $$(mangaSelectors.chapter.name).text()?.trim();
                mangaInfo.chapters.push({
                    slug: this.getChapterSlug(source, url)?.trim(),
                    url,
                    mangaSlug: slug?.trim(),
                    name: name?.trim(),
                    number:
                        Number(
                            $$(mangaSelectors.chapter.number).attr("data-num"),
                        ) || this.getChapterNumber(name?.trim()),
                    source: source as any,
                });
            });

            return mangaInfo;
        }
    }

    async chapter(source: MadaraSources, slug: string) {
        const SOURCE = SOURCES[source];
        const url = SOURCE.url + `/${slug}`;
        const { body, ok } = await this.get({
            url,
        });

        if (ok) {
            const $ = load(body);
            const name = $(
                `#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li.active`,
            )
                .text()
                ?.trim();

            const mangaUrl = $(
                `#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li:nth-child(2) > a`,
            ).attr("href");

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

            chapter.prevSlug = this.getChapterSlug(
                source,
                $(`div.nav-previous > a`).attr("href"),
            );
            chapter.nextSlug = this.getChapterSlug(
                source,
                $(`div.nav-next > a`).attr("href"),
            );

            $(`div.reading-content > div.page-break.no-gaps`).each((i, el) => {
                const $$ = load(el);
                chapter.pages.push(
                    this.genereateImageUrl(
                        $$(`img`).attr("src")?.trim(),
                        SOURCE.url,
                    ),
                );
            });

            return chapter;
        } else {
        }
    }

    genereateImageUrl(url: string, referer: string) {
        return `https://workers.emanga.tk/fetch?url=${encodeURIComponent(
            url,
        )}&referer=${encodeURIComponent(referer)}`;
    }

    async getSoruceGenres(source: MadaraSources) {
        const SOURCE = SOURCES[source];
        const { body, ok } = await this.get({
            url: SOURCE.url + SOURCE.pathes.manga,
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

    getMangaSlug(source: MadaraSources, url: string) {
        const SOURCE = SOURCES[source];
        return url?.replace(SOURCE.url + SOURCE.pathes.manga + "/", "");
    }

    getChapterNumber(name: string) {
        return (
            Number(
                name?.match(/[0-9]+(\.[0-9])?/g)?.[0]?.replace(/(\_|\-)/g, "."),
            ) || 0
        );
    }

    getChapterSlug(source: MadaraSources, url: string) {
        const SOURCE = SOURCES[source];
        return url?.replace(SOURCE.url + "/", "");
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
