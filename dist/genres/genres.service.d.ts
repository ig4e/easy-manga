import { MangaReaderService } from "../sources/manga-reader/manga-reader.service";
import { BaseInput } from "../manga/dto/manga.input";
export declare class GenresService {
    private mangaReader;
    constructor(mangaReader: MangaReaderService);
    getAll(input: BaseInput): Promise<import("./entities/genre.entity").Genre[]>;
}
