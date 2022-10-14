import { Injectable, NotFoundException } from "@nestjs/common";
import { MangaDexService } from "../sources/manga-dex/manga-dex.service";
import {
    MangaReaderService,
    MangaReaderSources,
} from "../sources/manga-reader/manga-reader.service";
import {
    MangalistInput,
    MangaSearchInput,
    MangaUniqueInput,
    Sources,
    SourcesType,
} from "./dto/manga.input";

@Injectable()
export class MangaService {
    constructor(
        private mangaReader: MangaReaderService,
        private mangaDex: MangaDexService,
    ) {}

    async search(input: MangaSearchInput) {
        let { mangaReader } = SourcesType;
        if (mangaReader.includes(input.source)) {
            return await this.mangaReader.search(
                input.source as MangaReaderSources,
                input.query,
            );
        }
    }

    async mangaList(input: MangalistInput = { page: 1, source: Sources.ARES }) {
        let { mangaReader } = SourcesType;
        if (mangaReader.includes(input.source)) {
            return Promise.all(
                (
                    await this.mangaReader.mangaList(
                        input.source as MangaReaderSources,
                        { page: input.page, ...input.filters },
                    )
                ).map(async (manga) => {
                    let {
                        aniId,
                        artist,
                        author,
                        cover,
                        dexId,
                        muId,
                        releaseYear,
                        ok,
                        year,
                        originalLanguage,
                        status,
                    } = await this.getDexResult(manga.title);
                    if (ok) {
                        manga.dexId = dexId;
                        manga.aniId = aniId;
                        manga.muId = muId;
                        manga.cover = this.mangaReader.genereateImageUrl(
                            cover,
                            "mangadex.org",
                        );
                        if (releaseYear) manga.releaseYear = releaseYear;
                        if (author) manga.author = author;
                        if (artist) manga.artist = artist;
                        if (status) manga.status = status;
                    }
                    return manga;
                }),
            );
        }
    }

    async manga(input: MangaUniqueInput) {
        let { mangaReader } = SourcesType;
        if (mangaReader.includes(input.source)) {
            let manga = await this.mangaReader.manga(
                input.source as MangaReaderSources,
                input.slug,
            );
            if (!manga) throw new NotFoundException();

            let {
                aniId,
                artist,
                author,
                cover,
                dexId,
                muId,
                releaseYear,
                ok,
                year,
                originalLanguage,
                status,
            } = await this.getDexResult(manga.title);
            if (ok) {
                manga.dexId = dexId;
                manga.aniId = aniId;
                manga.muId = muId;
                manga.cover = this.mangaReader.genereateImageUrl(
                    cover,
                    "mangadex.org",
                );
                if (releaseYear) manga.releaseYear = releaseYear;
                if (author) manga.author = author;
                if (artist) manga.artist = artist;
                if (status) manga.status = status;
            }

            return manga;
        }
    }

    async getDexResult(query: string) {
        //return { ok: false };
        let dexResult: any = await this.mangaDex.search(query);
        if (dexResult) {
            let image =
                `https://uploads.mangadex.org/covers/` +
                dexResult.id +
                `/` +
                dexResult.relationships.find(
                    (relation) => relation.type === "cover_art",
                ).attributes.fileName;

            let author = dexResult.relationships.find(
                (relation) => relation.type === "author",
            );

            let artist = dexResult.relationships.find(
                (relation) => relation.type === "artist",
            );

            console.log(dexResult);

            return {
                dexId: dexResult.id,
                aniId: dexResult?.attributes?.links?.al,
                muId: dexResult?.attributes?.links?.mu,
                cover: image,
                releaseYear: dexResult?.attributes?.year,
                author: author?.attributes?.name,
                artist: artist?.attributes?.name,
                status: dexResult?.attributes?.status,
                year: dexResult?.attributes?.year,
                originalLanguage: dexResult?.attributes?.originalLanguage,
                ok: true,
            };
        } else return { ok: false };
    }
}
