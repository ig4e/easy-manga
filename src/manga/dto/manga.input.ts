import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";

@InputType()
export class BaseInput {
    @Field((type) => Sources, { defaultValue: "ARES" })
    source: Sources;
}

@InputType()
export class MangaUniqueInput extends BaseInput {
    @Field()
    slug: string;
}

@InputType()
export class MangaSearchInput extends BaseInput {
    @Field()
    query: string;
}

@InputType()
export class MangaListFilters {
    @Field(() => [String], { nullable: true })
    genre?: string[];
    @Field(() => Status, { nullable: true })
    status?: Status;
    @Field(() => Type, { nullable: true })
    type?: Type;
    @Field(() => Order, { nullable: true })
    order?: Order;
    page?: number;
}

export enum Status {
    ONGOING = "ongoing",
    HIATUS = "hiatus",
    COMPLETED = "completed",
}

export enum Type {
    MANGA = "manga",
    MANHWA = "manhwa",
    MANHUA = "manhua",
    COMIC = "comic",
    NOVEL = "novel",
}

export enum Order {
    TITLE = "title",
    TITLEREVERSE = "titlereverse",
    UPDATE = "update",
    LATEST = "latest",
    POPULAR = "popular",
}

registerEnumType(Status, {
    name: "Status",
});

registerEnumType(Type, {
    name: "Type",
});

registerEnumType(Order, {
    name: "Order",
});

@InputType()
export class MangalistInput extends BaseInput {
    @Field(() => Int, { nullable: true })
    page?: number;
    @Field(() => MangaListFilters, { nullable: true })
    filters?: MangaListFilters;
}

export const SourcesType = {
    mangaReader: [
        "ARES",
        "GALAXYMANGA",
        "MANGASWAT",
        "OZULSCANS",
        "ARENASCANS",
    ],
    madara: [
        "MANGALEK",
        "MANGASPARK",
        "AZORA",
        "STKISSMANGA",
        "MANGAPROTM",
        "ASHQ",
    ],
    custom: ["MANGAAE", "TEAMX", "KISSMANGA", "MANGAKAKALOT"],
};

export enum Sources {
    ARES = "ARES",
    GALAXYMANGA = "GALAXYMANGA",
    MANGALEK = "MANGALEK",
    MANGASPARK = "MANGASPARK",
    AZORA = "AZORA",
    MANGASWAT = "MANGASWAT",
    MANGAAE = "MANGAAE",
    OZULSCANS = "OZULSCANS",
    TEAMX = "TEAMX",
    STKISSMANGA = "STKISSMANGA",
    KISSMANGA = "KISSMANGA",
    MANGAPROTM = "MANGAPROTM",
    ARENASCANS = "ARENASCANS",
    ASHQ = "ASHQ",
    MANGAKAKALOT = "MANGAKAKALOT",
}

registerEnumType(Sources, {
    name: "Sources",
});
