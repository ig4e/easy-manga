import { Injectable, NotFoundException } from "@nestjs/common";
import { MadaraService, MadaraSources } from "../sources/madara/madara.service";
import { SourcesType } from "../manga/dto/manga.input";
import {
    MangaReaderService,
    MangaReaderSources,
} from "../sources/manga-reader/manga-reader.service";
import { ChapterUniqueInput } from "./dto/chapter.input";

@Injectable()
export class ChaptersService {
    constructor(
        private mangaReader: MangaReaderService,
        private madara: MadaraService,
    ) {}

    async chapter(input: ChapterUniqueInput) {
        let { mangaReader, madara } = SourcesType;
        if (mangaReader.includes(input.source)) {
            const chapter = await this.mangaReader.chapter(
                input.source as MangaReaderSources,
                input.slug,
            );

            if (!chapter) throw new NotFoundException();
            return chapter;
        } else if (madara.includes(input.source)) {
            const chapter = await this.madara.chapter(
                input.source as MadaraSources,
                input.slug,
            );

            if (!chapter) throw new NotFoundException();
            return chapter;
        }
    }
}
