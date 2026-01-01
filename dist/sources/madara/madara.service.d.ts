import { OptionsOfTextResponseBody } from "got-scraping";
import { Manga } from "src/manga/entities/manga.entity";
import { Chapter } from "src/chapters/entities/chapter.entity";
import { Genre } from "src/genres/entities/genre.entity";
export type MadaraSources = "MANGALEK" | "MANGASPARK" | "AZORA" | "STKISSMANGA" | "MANGAPROTM" | "ASHQ";
export declare class MadaraService {
    constructor();
    search(source: MadaraSources, query: string): Promise<Manga[]>;
    mangaList(source: MadaraSources, page?: number): Promise<Manga[]>;
    manga(source: MadaraSources, slug: string): Promise<Manga>;
    chapter(source: MadaraSources, slug: string): Promise<Chapter>;
    genereateImageUrl(url: string, referer: string): string;
    getSoruceGenres(source: MadaraSources): Promise<Genre[]>;
    getMangaSlug(source: MadaraSources, url: string): string;
    getChapterNumber(name: string): number;
    getChapterSlug(source: MadaraSources, url: string): string;
    get(options: OptionsOfTextResponseBody): Promise<import("got-scraping").Response<string>>;
    solveSucuri(str: string): any;
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
            coverAttr: string;
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
            coverAttr: string;
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
export {};
