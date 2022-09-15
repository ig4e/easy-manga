import { Resolver, Query, Args } from "@nestjs/graphql";
import { MangaService } from "./manga.service";
import { Manga } from "./entities/manga.entity";
import {
    MangalistInput,
    MangaSearchInput,
    MangaUniqueInput,
} from "./dto/manga.input";

@Resolver(() => Manga)
export class MangaResolver {
    constructor(private readonly mangaService: MangaService) {}

    @Query(() => [Manga], { name: "search" })
    search(@Args("searchInput") searchInput: MangaSearchInput) {
        return this.mangaService.search(searchInput);
    }

    @Query(() => Manga, { name: "manga" })
    findOne(@Args("mangaUniqueInput") mangaUniqueInput: MangaUniqueInput) {
        return this.mangaService.manga(mangaUniqueInput);
    }

    @Query(() => [Manga], { name: "mangaList" })
    findAll(
        @Args("mangaListInput", { nullable: true })
        mangaListInput: MangalistInput,
    ) {
        return this.mangaService.mangaList(mangaListInput);
    }
}
