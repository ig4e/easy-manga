import { Controller, Get, Query } from "@nestjs/common";
import { MangaListFilters, Sources } from "../manga/dto/manga.input";
import { CustomSourceService } from "./custom/custom.service";
import { MangaReaderService } from "./manga-reader/manga-reader.service";

@Controller("sources-data")
export class SourcesDataController {
    constructor(
        private mangaReader: MangaReaderService,
        private customSource: CustomSourceService,
    ) {}
    @Get("/search")
    async search(
        @Query("source")
        source: "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS",
        @Query("query") query: string,
    ) {
        return this.mangaReader.search(source, query);
    }

    @Get("/manga-list")
    async mangaList(
        @Query("source")
        source: "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS",
        @Query() filters: MangaListFilters,
    ) {
        return this.mangaReader.mangaList(source, filters);
    }

    @Get("/manga")
    async manga(
        @Query("source")
        source: "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS",
        @Query("slug") slug: string,
    ) {
        return this.mangaReader.manga(source, slug);
    }

    @Get("/chapter")
    async chapter(
        @Query("source")
        source: "ARES" | "GALAXYMANGA" | "MANGASWAT" | "OZULSCANS",
        @Query("slug") slug: string,
    ) {
        return this.mangaReader.chapter(source, slug);
    }

    @Get("/custom-source/manga")
    async customSourceManga(@Query("slug") slug: string) {
        return this.customSource.manga(Sources.TEAMX, slug);
    }

    @Get("/custom-source/list")
    async customSourceMangalist(@Query("page") page: string) {
        return this.customSource.mangaList(Sources.TEAMX, Number(page));
    }

    @Get("/custom-source/search")
    async customSourceSearch(@Query("query") query: string) {
        return this.customSource.search(Sources.TEAMX, query);
    }

    @Get("/custom-source/chapter")
    async customSourceChapter(@Query("slug") slug: string) {
        return this.customSource.chapter(Sources.TEAMX, slug);
    }
}
