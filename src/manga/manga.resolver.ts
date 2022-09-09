import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MangaService } from './manga.service';
import { Manga } from './entities/manga.entity';
import { MangaUniqueInput } from './dto/manga.input';

@Resolver(() => Manga)
export class MangaResolver {
  constructor(private readonly mangaService: MangaService) {}

  @Query(() => Manga, { name: 'manga' })
  findOne(@Args('mangaUniqueInput') mangaUniqueInput: MangaUniqueInput) {

  }

  @Query(() => [Manga], { name: 'mangaList' })
  findAll() {}
}
