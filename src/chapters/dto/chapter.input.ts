import { Field, InputType } from "@nestjs/graphql";
import { BaseInput, Sources } from "../../manga/dto/manga.input";

@InputType()
export class ChapterUniqueInput extends BaseInput {
    @Field()
    slug: string;
}
