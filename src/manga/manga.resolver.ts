import { Resolver, Query, Args } from "@nestjs/graphql";
import { MangaService } from "./manga.service";
import { Manga } from "./entities/manga.entity";
import {
    MangalistInput,
    MangaSearchInput,
    MangaUniqueInput,
} from "./dto/manga.input";
import { CacheControl } from "nestjs-gql-cache-control";

@Resolver(() => Manga)
export class MangaResolver {
    constructor(private readonly mangaService: MangaService) {}

    @Query(() => [Manga], { name: "search" })
    @CacheControl({ maxAge: 10, scope: "PUBLIC" })
    async search(@Args("searchInput") searchInput: MangaSearchInput) {
        try {
            const searchResult = await this.mangaService.search(searchInput);

            return searchResult
        } catch {
            return []
        }
    }

    @Query(() => Manga, { name: "manga" })
    @CacheControl({ maxAge: 10, scope: "PUBLIC" })
    async findOne(
        @Args("mangaUniqueInput") mangaUniqueInput: MangaUniqueInput,
    ) {
        return await this.mangaService.manga(mangaUniqueInput);
    }

    @Query(() => [Manga], { name: "mangaList" })
    @CacheControl({ maxAge: 10, scope: "PUBLIC" })
    async findAll(
        @Args("mangaListInput", { nullable: true })
        mangaListInput: MangalistInput,
    ) {
        const mangaList = await this.mangaService.mangaList(mangaListInput);
        return mangaList;
    }
}
