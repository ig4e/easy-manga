import { Resolver, Query, Args } from "@nestjs/graphql";
import { GenresService } from "./genres.service";
import { Genre } from "./entities/genre.entity";
import { BaseInput } from "../manga/dto/manga.input";

@Resolver(() => Genre)
export class GenresResolver {
    constructor(private readonly genresService: GenresService) {}

    @Query(() => [Genre], { name: "genres" })
    findAll(@Args("genresInput") genresInput: BaseInput) {
        return this.genresService.getAll(genresInput);
    }
}
