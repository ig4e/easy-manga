import { Injectable } from "@nestjs/common";
import { MangaReaderService } from "../sources-data/manga-reader/manga-reader.service";
import { BaseInput, SourcesType } from "../manga/dto/manga.input";

@Injectable()
export class GenresService {
    constructor(private mangaReader: MangaReaderService) {}

    getAll(input: BaseInput) {
        let { mangaReader } = SourcesType;
        if (mangaReader.includes(input.source)) {
            return this.mangaReader.getSoruceGenres(input.source as any);
        }
    }
}
