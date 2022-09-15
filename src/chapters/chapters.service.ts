import { Injectable, NotFoundException } from "@nestjs/common";
import { SourcesType } from "../manga/dto/manga.input";
import {
    MangaReaderService,
    MangaReaderSources,
} from "../sources/manga-reader/manga-reader.service";
import { ChapterUniqueInput } from "./dto/chapter.input";

@Injectable()
export class ChaptersService {
    constructor(private mangaReader: MangaReaderService) {}

    async chapter(input: ChapterUniqueInput) {
        let { mangaReader } = SourcesType;
        if (mangaReader.includes(input.source)) {
            const chapter = await this.mangaReader.chapter(
                input.source as MangaReaderSources,
                input.slug,
            );

            if (!chapter) throw new NotFoundException();
            return chapter;
        }
    }
}
