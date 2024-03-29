import { AxiosInstance } from "axios";
import { CustomSourceService } from "../sources/custom/custom.service";
import { MadaraService } from "../sources/madara/madara.service";
import { MangaDexService } from "../sources/manga-dex/manga-dex.service";
import { MangaReaderService } from "../sources/manga-reader/manga-reader.service";
import { MangalistInput, MangaSearchInput, MangaUniqueInput, Sources } from "./dto/manga.input";
import { Manga } from "./entities/manga.entity";
import { MeiliService } from "../meili.service";
export declare class MangaService {
    private mangaReader;
    private madara;
    private customSource;
    private mangaDex;
    private meili;
    axiosClient: AxiosInstance;
    constructor(mangaReader: MangaReaderService, madara: MadaraService, customSource: CustomSourceService, mangaDex: MangaDexService, meili: MeiliService);
    search(input: MangaSearchInput): Promise<(Manga | {
        dexId: any;
        aniId: any;
        muId: any;
        cover: string;
        covers: any;
        altTitles: any;
        slug: string;
        url: string;
        title: string;
        genres: string[];
        synopsis?: string;
        status?: string;
        type?: string;
        author?: string;
        artist?: string;
        releaseYear?: number;
        score?: number;
        chapters?: import("../chapters/entities/chapter.entity").Chapter[];
        source: Sources;
    })[]>;
    mangaList(input?: MangalistInput): Promise<(Manga | {
        dexId: any;
        aniId: any;
        muId: any;
        cover: string;
        covers: any;
        altTitles: any;
        slug: string;
        url: string;
        title: string;
        genres: string[];
        synopsis?: string;
        status?: string;
        type?: string;
        author?: string;
        artist?: string;
        releaseYear?: number;
        score?: number;
        chapters?: import("../chapters/entities/chapter.entity").Chapter[];
        source: Sources;
    })[]>;
    manga(input: MangaUniqueInput): Promise<Manga | {
        dexId: any;
        aniId: any;
        muId: any;
        cover: string;
        covers: any;
        altTitles: any;
        slug: string;
        url: string;
        title: string;
        genres: string[];
        synopsis?: string;
        status?: string;
        type?: string;
        author?: string;
        artist?: string;
        releaseYear?: number;
        score?: number;
        chapters?: import("../chapters/entities/chapter.entity").Chapter[];
        source: Sources;
    }>;
    addDexFieldsToArray(manga: Manga[]): Promise<(Manga | {
        dexId: any;
        aniId: any;
        muId: any;
        cover: string;
        covers: any;
        altTitles: any;
        slug: string;
        url: string;
        title: string;
        genres: string[];
        synopsis?: string;
        status?: string;
        type?: string;
        author?: string;
        artist?: string;
        releaseYear?: number;
        score?: number;
        chapters?: import("../chapters/entities/chapter.entity").Chapter[];
        source: Sources;
    })[]>;
}
