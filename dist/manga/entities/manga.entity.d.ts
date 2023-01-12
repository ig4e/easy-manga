import { Chapter } from "../../chapters/entities/chapter.entity";
import { Sources } from "../dto/manga.input";
export declare class Manga {
    dexId?: string;
    aniId?: string;
    muId?: string;
    slug: string;
    url: string;
    cover: string;
    covers?: MangaCover[];
    title: string;
    altTitles: string[];
    genres: string[];
    synopsis?: string;
    status?: string;
    type?: string;
    author?: string;
    artist?: string;
    releaseYear?: number;
    score?: number;
    chapters?: Chapter[];
    source: Sources;
}
declare class MangaCover {
    url: string;
    volume: string;
}
export {};
