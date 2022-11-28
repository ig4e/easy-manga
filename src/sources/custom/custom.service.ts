import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { gotScraping, OptionsOfTextResponseBody } from "got-scraping";
import { CheerioAPI, load } from "cheerio/lib/slim";
import { Manga } from "../../manga/entities/manga.entity";
import { Chapter } from "../..//chapters/entities/chapter.entity";
import { Genre } from "../..//genres/entities/genre.entity";
import { Sources } from "../..//manga/dto/manga.input";
const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";

const TEAMX: SourceSettings = {
    source: Sources.TEAMX,
    url: "https://mnhaestate.com",
    pathes: { manga: "/series" },
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
        getMangaSlug(url: string) {
            return url?.replace(this.url, "")?.replace(this.pathes.manga, "");
        },
        getChapterSlug(url: string) {
            return url?.replace(this.url, "")?.replace(this.pathes.manga, "");
        },

        async getSearchData(query: string, sourceData: SourceSettings) {
            const results: Manga[] = [];
            const url = `https://mnhaestate.com/ajax/search?keyword=${encodeURIComponent(
                query,
            )}`;
            const { body } = await gotScraping(url, {
                method: "GET",
                dnsCache: true,
            });

            const $ = load(body);

            $(`ol > li`).each((i, el) => {
                const $$ = load(el);
                const url = $$(`a`).attr("href");
                results.push({
                    url,
                    slug: this.utils.getMangaSlug.bind(sourceData)(url),
                    title: $$(`a`).text()?.trim(),
                    cover: `https://workers.emanga.tk/fetch?url=${encodeURIComponent(
                        $$("a > img").attr("src"),
                    )}&referer=${encodeURIComponent(url)}`,
                    altTitles: [],
                    genres: [],
                    source: sourceData.source,
                });
            });

            return results;
        },

        getMangaUrl(slug: string, page: number = 1) {
            return clearDupleSlashes(
                this.url + this.pathes.manga + `/` + slug + `?page=${page}`,
            );
        },

        getMangaListUrl(page: number = 1) {
            return clearDupleSlashes(
                this.url + this.pathes.manga + `/?page=${page}`,
            );
        },

        getChapterUrl(slug: string) {
            return clearDupleSlashes(this.url + this.pathes.manga + `/` + slug);
        },
    },
};

const KISSMANGA: SourceSettings = {
    source: Sources.KISSMANGA,
    url: "https://kissmanga.org",
    pathes: { manga: "/manga", mangaList: "/manga_list", chapter: "/chapter" },
    selectors: {
        manga: {
            title: "#leftside > div:nth-child(1) > div.barContent.full > div.full > h2 > strong",
            altTitles:
                "#leftside > div:nth-child(1) > div.barContent.full > div.full > p:nth-child(2) > a",
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
        getMangaSlug(url: string) {
            return url?.replace(this.url, "")?.replace(this.pathes.manga, "");
        },

        getChapterSlug(url: string) {
            return url?.replace(this.url, "")?.replace(this.pathes.chapter, "");
        },

        async getSearchData(query: string, sourceData: SourceSettings) {
            const results: Manga[] = [];
            const url = `https://kissmanga.org/Search/SearchSuggest?keyword=${encodeURIComponent(
                query,
            )}`;
            const { body } = await gotScraping(url, {
                method: "GET",
                dnsCache: true,
            });

            const $ = load(body);

            $(`a.item_search_link`).each((i, el) => {
                const $$ = load(el);
                const url = sourceData.url + $$(`a`).attr("href");
                const slug = this.utils.getMangaSlug.bind(sourceData)(url);

                results.push({
                    url,
                    slug: slug,
                    title: $$(`a`).text()?.trim(),
                    cover: `https://workers.emanga.tk/fetch?url=${encodeURIComponent(
                        `https://kissmanga.org/mangaimage/${slug}.jpg`,
                    )}&referer=${encodeURIComponent(url)}`,
                    altTitles: [],
                    genres: [],
                    source: sourceData.source,
                });
            });

            return results;
        },

        getMangaCover(slug: string) {
            return clearDupleSlashes(
                `https://kissmanga.org/mangaimage${
                    slug?.startsWith("/") ? slug : "/" + slug
                }.jpg`,
            );
        },

        getMangaUrl(slug: string, page: number = 1) {
            return clearDupleSlashes(
                this.url + this.pathes.manga + `/` + slug + `?page=${page}`,
            );
        },

        getMangaListUrl(page: number = 1) {
            return clearDupleSlashes(
                this.url + this.pathes.mangaList + `/?page=${page}`,
            );
        },

        getChapterUrl(slug: string) {
            return clearDupleSlashes(
                this.url + this.pathes.chapter + `/` + slug,
            );
        },
    },
};

const customSources = {
    TEAMX,
    KISSMANGA,
};

@Injectable()
export class CustomSourceService {
    async search(source: Sources, query: string) {
        const sourceData: SourceSettings = customSources[source];
        const data = await sourceData.utils.getSearchData.bind(sourceData)(
            query,
            sourceData,
        );

        return data;
    }

    async mangaList(source: Sources, page: number = 0) {
        const result: Manga[] = [];
        const sourceData: SourceSettings = customSources[source];
        const url = sourceData.utils.getMangaListUrl.bind(sourceData)(page);
        const { body } = await gotScraping(url, {
            cache: true,
            dnsCache: true,
        });
        const $ = load(body);

        $(sourceData.selectors.mangaList.list).each((i, el) => {
            const $$ = load(el);
            const url = $$(sourceData.selectors.mangaList.url).attr("href");
            const slug = sourceData.utils.getMangaSlug.bind(sourceData)(url);
            const manga: Manga = {
                url,
                slug,
                title: $$(sourceData.selectors.mangaList.title).text().trim(),
                cover: this.genereateImageUrl(
                    sourceData.utils.getMangaCover
                        ? sourceData.utils.getMangaCover(slug)
                        : $$(sourceData.selectors.mangaList.cover).attr("src"),
                    url,
                ),
                altTitles: [],
                genres: [],
                source: sourceData.source,
                score: Number(
                    $$(sourceData.selectors.mangaList.score).text()?.trim(),
                ),
                chapters: [],
            };

            result.push(manga);
        });

        return result;
    }

    async manga(source: Sources, slug: string) {
        const getChapterNumber = this.getChapterNumber;
        const sourceData: SourceSettings = customSources[source];
        const url = sourceData.utils.getMangaUrl.bind(sourceData)(slug);
        const { body } = await gotScraping(url, {
            cache: true,
            dnsCache: true,
        });
        const $ = load(body);

        const mangaDetails: Manga = {
            url,
            slug,
            title: $(sourceData.selectors.manga.title).text()?.trim(),
            cover: this.genereateImageUrl(
                sourceData.utils.getMangaCover
                    ? sourceData.utils.getMangaCover(slug)
                    : $(sourceData.selectors.manga.cover).attr("src"),
                url,
            ),
            source: Sources[source],
            author: $(sourceData.selectors.manga.author).text()?.trim(),
            artist: $(sourceData.selectors.manga.artist).text()?.trim(),
            synopsis: $(sourceData.selectors.manga.synopsis).text()?.trim(),
            releaseYear: Number(
                $(sourceData.selectors.manga.releasedAt).text()?.trim(),
            ),
            score: Number($(sourceData.selectors.manga.score).text()?.trim()),
            status: $(sourceData.selectors.manga.status).text()?.trim(),
            type: $(sourceData.selectors.manga.type).text()?.trim(),

            altTitles: [],
            genres: [],
            chapters: [],
        };

        $(sourceData.selectors.manga.genre).each((i, el) => {
            const $$ = load(el);
            mangaDetails.genres.push(
                $$(el)
                    .text()
                    ?.trim()
                    ?.split(" ")
                    ?.map((x) => x.trim())
                    .join(" "),
            );
        });

        getChapters($);

        if (
            sourceData.selectors.manga.chapter.lastChaptersPage &&
            mangaDetails.chapters.length >
                sourceData.selectors.manga.chapter.pageSize
        ) {
            let lastCount = mangaDetails.chapters.length;
            let page = 1;
            do {
                lastCount = mangaDetails.chapters.length;
                const url = sourceData.utils.getMangaUrl.bind(sourceData)(
                    slug,
                    page,
                );
                const { body } = await gotScraping(url, {
                    cache: true,
                    dnsCache: true,
                });
                const $$$ = load(body);
                getChapters($$$);
                page++;
            } while (mangaDetails.chapters.length > lastCount);
        }

        return mangaDetails;

        function getChapters($: CheerioAPI) {
            $(sourceData.selectors.manga.chapter.list).each((i, el) => {
                const $$ = load(el);
                const url = $$(sourceData.selectors.manga.chapter.url).attr(
                    "href",
                );

                mangaDetails.chapters.push({
                    slug: sourceData.utils.getChapterSlug.bind(sourceData)(url),
                    name: $$(sourceData.selectors.manga.chapter.name)
                        .text()
                        ?.trim()
                        ?.split(" ")
                        ?.map((x) => x.trim())
                        .join(" "),
                    number: getChapterNumber(
                        $$(sourceData.selectors.manga.chapter.number)
                            .text()
                            ?.trim(),
                    ),
                    mangaSlug: mangaDetails.slug,
                    url,
                    source: Sources[source],
                });
            });
        }
    }

    async chapter(source: Sources, slug: string) {
        const sourceData: SourceSettings = customSources[source];
        const url = sourceData.utils.getChapterUrl.bind(sourceData)(slug);
        const { body } = await gotScraping(url, {
            cache: true,
            dnsCache: true,
        });
        const $ = load(body);

        const chapterData: Chapter = {
            url,
            slug,
            name: $(sourceData.selectors.chapter.name).text()?.trim(),
            number: this.getChapterNumber(
                $(sourceData.selectors.chapter.number).text()?.trim(),
            ),
            mangaSlug: sourceData.utils.getMangaSlug.bind(sourceData)(
                $(sourceData.selectors.chapter.mangaUrl).attr("href"),
            ),
            nextSlug: sourceData.utils.getChapterSlug.bind(sourceData)(
                $(sourceData.selectors.chapter.next).attr("href"),
            ),
            prevSlug: sourceData.utils.getChapterSlug.bind(sourceData)(
                $(sourceData.selectors.chapter.prev).attr("href"),
            ),
            pages: [],
            source: sourceData.source,
        };

        $(sourceData.selectors.chapter.page).each((i, el) => {
            const $$ = load(el);
            chapterData.pages.push(
                this.genereateImageUrl($$(el).attr("src"), url),
            );
        });

        return chapterData;
    }

    getChapterNumber(name: string) {
        return (
            Number(
                name.match(/[0-9]+(\.[0-9])?/g)?.[0]?.replace(/(\_|\-)/g, "."),
            ) || 0
        );
    }

    genereateImageUrl(url: string, referer: string) {
        return `https://workers.emanga.tk/fetch?url=${encodeURIComponent(
            url,
        )}&referer=${encodeURIComponent(referer)}`;
    }
}

export interface SourceSettings {
    source: Sources;
    url: string;
    pathes: {
        manga: string;
        mangaList?: string;
        chapter?: string;
    };
    utils: {
        [index: string]: Function;
    };
    selectors: {
        mangaList: {
            list: string;
            title: string;
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
                lastChaptersPage?: string;
                pageSize?: number;
            };
        };
        chapter: {
            mangaUrl: string;
            name: string;
            number: string;
            next: string;
            prev: string;
            page: string;
        };
    };
}

function clearDupleSlashes(string: string) {
    return (
        "https://" +
        string
            .replace("https://", "")
            .replace("http://", "")
            .replace(/\/\//g, "/")
    );
}
