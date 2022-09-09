import { Field, InputType } from '@nestjs/graphql';
import { Sources } from '../../manga/dto/manga.input';

@InputType()
export class ChapterInput {
  @Field((type) => Sources)
  source: Sources;
}

@InputType()
export class ChapterUniqueInput extends ChapterInput {
  @Field()
  slug: string;
}
