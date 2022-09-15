import { ObjectType, Field, Int, Float } from "@nestjs/graphql";
import { Chapter } from "../../chapters/entities/chapter.entity";

@ObjectType()
export class Manga {
    @Field({ nullable: true })
    dexId?: string;
    @Field({ nullable: true })
    aniId?: string;
    @Field({ nullable: true })
    muId?: string;
    @Field()
    slug: string;
    @Field()
    url: string;
    @Field()
    cover: string;
    @Field()
    title: string;
    @Field(() => [String])
    altTitles: string[];
    @Field(() => [String])
    genres: string[];
    @Field({ nullable: true })
    synopsis?: string;
    @Field({ nullable: true })
    status?: string;
    @Field({ nullable: true })
    type?: string;
    @Field({ nullable: true })
    author?: string;
    @Field({ nullable: true })
    artist?: string;
    @Field(() => Int, { nullable: true })
    releaseYear?: number;
    @Field(() => Float, { nullable: true })
    score?: number;
    @Field(() => [Chapter], { nullable: true })
    chapters?: Chapter[];
}
