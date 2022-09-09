import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Chapter {
  @Field()
  url: string;
  @Field()
  slug: string;
  @Field()
  name: string;
  @Field(() => Float)
  number: number;
  @Field({ nullable: true })
  createdAt?: Date;
  @Field({ nullable: true })
  nextSlug?: string;
  @Field({ nullable: true })
  prevSlug?: string;
  @Field(() => [Chapter])
  otherChapters?: Chapter[];
  @Field(() => [String], { nullable: true })
  pages?: string[];
}
