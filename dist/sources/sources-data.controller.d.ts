import { MangaListFilters } from "../manga/dto/manga.input";
import { CustomSourceService } from "./custom/custom.service";
import { MangaReaderService } from "./manga-reader/manga-reader.service";
export declare class SourcesDataController {
    private mangaReader;
    private customSource;
    constructor(mangaReader: MangaReaderService, customSource: CustomSourceService);
    search(source: "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS", query: string): Promise<import("../manga/entities/manga.entity").Manga[]>;
    mangaList(source: "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS", filters: MangaListFilters): Promise<import("../manga/entities/manga.entity").Manga[]>;
    manga(source: "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS", slug: string): Promise<import("../manga/entities/manga.entity").Manga>;
    chapter(source: "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS", slug: string): Promise<import("../chapters/entities/chapter.entity").Chapter>;
    customSourceManga(slug: string): Promise<import("../manga/entities/manga.entity").Manga>;
    customSourceMangalist(page: string): Promise<import("../manga/entities/manga.entity").Manga[]>;
    customSourceSearch(query: string): Promise<any>;
    customSourceChapter(slug: string): Promise<import("../chapters/entities/chapter.entity").Chapter>;
}
