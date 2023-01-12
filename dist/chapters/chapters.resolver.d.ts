import { MangaService } from ".././manga/manga.service";
import { ChaptersService } from "./chapters.service";
import { ChapterUniqueInput } from "./dto/chapter.input";
import { Chapter } from "./entities/chapter.entity";
export declare class ChaptersResolver {
    private readonly chaptersService;
    private mangaService;
    constructor(chaptersService: ChaptersService, mangaService: MangaService);
    findOne(chapterUniqueInput: ChapterUniqueInput): Promise<Chapter>;
    otherChapters(parent: Chapter): Promise<Chapter[]>;
}
