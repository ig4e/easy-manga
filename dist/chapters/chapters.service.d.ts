import { MadaraService } from "../sources/madara/madara.service";
import { MangaReaderService } from "../sources/manga-reader/manga-reader.service";
import { ChapterUniqueInput } from "./dto/chapter.input";
import { CustomSourceService } from "../sources/custom/custom.service";
export declare class ChaptersService {
    private mangaReader;
    private madara;
    private customSource;
    constructor(mangaReader: MangaReaderService, madara: MadaraService, customSource: CustomSourceService);
    chapter(input: ChapterUniqueInput): Promise<import("./entities/chapter.entity").Chapter>;
}
