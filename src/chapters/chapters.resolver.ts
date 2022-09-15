import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    ResolveField,
    Parent,
    Context,
} from "@nestjs/graphql";
import { Sources } from "../manga/dto/manga.input";
import { MangaService } from ".././manga/manga.service";
import { ChaptersService } from "./chapters.service";
import { ChapterUniqueInput } from "./dto/chapter.input";
import { Chapter } from "./entities/chapter.entity";

@Resolver(() => Chapter)
export class ChaptersResolver {
    constructor(
        private readonly chaptersService: ChaptersService,
        private mangaService: MangaService,
    ) {}

    @Query(() => Chapter, { name: "chapter" })
    findOne(
        @Args("chapterUniqueInput") chapterUniqueInput: ChapterUniqueInput,
    ) {
        return this.chaptersService.chapter(chapterUniqueInput);
    }

    @ResolveField("otherChapters", () => [Chapter])
    async otherChapters(@Parent() parent: Chapter) {
        let manga = await this.mangaService.manga({
            slug: parent.mangaSlug!,
            source: parent.source,
        });
        return manga.chapters;
    }
}
