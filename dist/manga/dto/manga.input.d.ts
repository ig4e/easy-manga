export declare class BaseInput {
    source: Sources;
}
export declare class MangaUniqueInput extends BaseInput {
    slug: string;
}
export declare class MangaSearchInput extends BaseInput {
    query: string;
}
export declare class MangaListFilters {
    genre?: string[];
    status?: Status;
    type?: Type;
    order?: Order;
    page?: number;
}
export declare enum Status {
    ONGOING = "ongoing",
    HIATUS = "hiatus",
    COMPLETED = "completed"
}
export declare enum Type {
    MANGA = "manga",
    MANHWA = "manhwa",
    MANHUA = "manhua",
    COMIC = "comic",
    NOVEL = "novel"
}
export declare enum Order {
    TITLE = "title",
    TITLEREVERSE = "titlereverse",
    UPDATE = "update",
    LATEST = "latest",
    POPULAR = "popular"
}
export declare class MangalistInput extends BaseInput {
    page?: number;
    filters?: MangaListFilters;
}
export declare const SourcesType: {
    mangaReader: string[];
    madara: string[];
    custom: string[];
};
export declare enum Sources {
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
    MANGAKAKALOT = "MANGAKAKALOT"
}
