import { Sources } from "../../manga/dto/manga.input";
export declare class Chapter {
    url?: string;
    slug?: string;
    mangaSlug?: string;
    name: string;
    number: number;
    createdAt?: Date;
    nextSlug?: string;
    prevSlug?: string;
    otherChapters?: Chapter[];
    pages?: string[];
    source?: Sources;
}
