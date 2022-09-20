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
                    } = await this.getDexResult(manga.title);
                    if (ok) {
                        manga.dexId = dexId;
                        manga.aniId = aniId;
                        manga.muId = muId;
                        manga.cover = this.mangaReader.genereateImageUrl(
                            cover,
                            "mangadex.org",
                        );
                        manga.releaseYear = releaseYear;
                        if (author?.name) manga.author = author?.name;
                        if (artist?.name) manga.artist = artist?.name;
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

            let { aniId, artist, author, cover, dexId, muId, releaseYear, ok } =
                await this.getDexResult(manga.title);
            if (ok) {
                manga.dexId = dexId;
                manga.aniId = aniId;
                manga.muId = muId;
                manga.cover = this.mangaReader.genereateImageUrl(
                    cover,
                    "mangadex.org",
                );
                manga.releaseYear = releaseYear;
                manga.author = author.name;
                manga.artist = artist.name;
            }

            return manga;
        }
    }

    async getDexResult(query: string) {
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
            )?.attributes;

            let artist = dexResult.relationships.find(
                (relation) => relation.type === "artist",
            )?.attributes;

            return {
                dexId: dexResult.id,
                aniId: dexResult?.attributes?.links?.al,
                muId: dexResult?.attributes?.links?.mu,
                cover: image,
                releaseYear: dexResult?.attributes?.year,
                author: author?.name,
                artist: artist?.name,
                ok: true,
            };
        } else return { ok: false };
    }
}
