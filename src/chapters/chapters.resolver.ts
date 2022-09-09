import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChaptersService } from './chapters.service';
import { ChapterUniqueInput } from './dto/chapter.input';
import { Chapter } from './entities/chapter.entity';

@Resolver(() => Chapter)
export class ChaptersResolver {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Query(() => Chapter, { name: 'chapter' })
  findOne(@Args('chapterUniqueInput') chapterUniqueInput: ChapterUniqueInput) {
    
  }
}
