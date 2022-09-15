import { Injectable, NotFoundException } from "@nestjs/common";
import {
    MangaReaderService,
    MangaReaderSources,
} from "../sources-data/manga-reader/manga-reader.service";
import {
    MangalistInput,
    MangaSearchInput,
    MangaUniqueInput,
    Sources,
    SourcesType,
} from "./dto/manga.input";

@Injectable()
export class MangaService {
    constructor(private mangaReader: MangaReaderService) {}

    async search(input: MangaSearchInput) {
        let { mangaReader } = SourcesType;
        if (mangaReader.includes(input.source)) {
            return await this.mangaReader.search(
                input.source as MangaReaderSources,
                input.query,
            );
        }
    }

    async mangaList(input: MangalistInput = { page: 1, source: Sources.ARES}) {
        let { mangaReader } = SourcesType;
        if (mangaReader.includes(input.source)) {
            return await this.mangaReader.mangaList(
                input.source as MangaReaderSources,
                input.filters,
            );
        }
    }

    async manga(input: MangaUniqueInput) {
        let { mangaReader } = SourcesType;
        if (mangaReader.includes(input.source)) {
            let manga = await this.mangaReader.manga(
                input.source as MangaReaderSources,
                input.slug,
            );
            if (!manga) throw new NotFoundException();
            return manga;
        }
    }
}
