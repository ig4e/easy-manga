import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Genre {
    @Field(() => Int, { description: "Genre id" })
    id: number;
    @Field({ description: "Genre name" })
    name: string;
}
