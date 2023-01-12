import { OptionsOfTextResponseBody } from "got-scraping";
import { Manga } from "src/manga/entities/manga.entity";
import { Chapter } from "src/chapters/entities/chapter.entity";
import { MangaListFilters } from "src/manga/dto/manga.input";
import { Genre } from "src/genres/entities/genre.entity";
export declare type MangaReaderSources = "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS" | "ARENASCANS";
export declare class MangaReaderService {
    constructor();
    search(source: MangaReaderSources, query: string): Promise<Manga[]>;
    mangaList(source: MangaReaderSources, mangaListOptions?: MangaListFilters): Promise<Manga[]>;
    manga(source: MangaReaderSources, slug: string): Promise<Manga>;
    chapter(source: MangaReaderSources, slug: string): Promise<Chapter>;
    genereateImageUrl(url: string, referer: string): string;
    getSoruceGenres(source: MangaReaderSources): Promise<Genre[]>;
    getMangaSlug(source: MangaReaderSources, url: string): string;
    getChapterNumber(name: string): number;
    getChapterSlug(source: MangaReaderSources, url: string): string;
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
export {};
