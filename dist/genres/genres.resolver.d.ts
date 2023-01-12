import { GenresService } from "./genres.service";
import { Genre } from "./entities/genre.entity";
import { BaseInput } from "../manga/dto/manga.input";
export declare class GenresResolver {
    private readonly genresService;
    constructor(genresService: GenresService);
    findAll(genresInput: BaseInput): Promise<Genre[]>;
}
