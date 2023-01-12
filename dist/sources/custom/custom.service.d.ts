import { Manga } from "../../manga/entities/manga.entity";
import { Chapter } from "../..//chapters/entities/chapter.entity";
import { Sources } from "../..//manga/dto/manga.input";
export declare class CustomSourceService {
    search(source: Sources, query: string): Promise<any>;
    mangaList(source: Sources, page: number, order: "top" | "new" | "latest"): Promise<Manga[]>;
    manga(source: Sources, slug: string): Promise<Manga>;
    chapter(source: Sources, slug: string): Promise<Chapter>;
    getChapterNumber(name: string): number;
    genereateImageUrl(url: string, referer: string): string;
}
export interface SourceSettings {
    source: Sources;
    url: string;
    pathes: {
        manga: string;
        mangaList?: string;
        chapter?: string;
    };
    config: {
        scoreMultiplyBy: number;
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
