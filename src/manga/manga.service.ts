import { Injectable, NotFoundException } from "@nestjs/common";
import axios from "axios";
import { randomUUID } from "crypto";
import { CustomSourceService } from "../sources/custom/custom.service";
import { MadaraService, MadaraSources } from "../sources/madara/madara.service";
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
import { Manga } from "./entities/manga.entity";
import Fuse from "fuse.js";
import { ratio } from "fuzzball";
import { MeiliService } from "../meili.service";

@Injectable()
export class MangaService {
    constructor(
        private mangaReader: MangaReaderService,
        private madara: MadaraService,
        private customSource: CustomSourceService,
        private mangaDex: MangaDexService,
        private meili: MeiliService,
    ) {}

    async search(input: MangaSearchInput) {
        let { mangaReader, madara, custom } = SourcesType;
        let mangaArrResult: Manga[];

        if (mangaReader.includes(input.source)) {
            mangaArrResult = await this.mangaReader.search(
                input.source as MangaReaderSources,
                input.query,
            );
        } else if (madara.includes(input.source)) {
            mangaArrResult = await this.madara.search(
                input.source as MadaraSources,
                input.query,
            );
        } else if (custom.includes(input.source)) {
            mangaArrResult = await this.customSource.search(
                input.source,
                input.query,
            );
        }

        return await this.addDexFieldsToArray(mangaArrResult);
    }

    async mangaList(input: MangalistInput = { page: 1, source: Sources.ARES }) {
        let { mangaReader, madara, custom } = SourcesType;
        let mangaArrResult: Manga[];

        if (mangaReader.includes(input.source)) {
            mangaArrResult = await this.mangaReader.mangaList(
                input.source as MangaReaderSources,
                { page: input.page, ...input.filters },
            );
        } else if (madara.includes(input.source)) {
            mangaArrResult = await this.madara.mangaList(
                input.source as MadaraSources,
                input.page,
            );
        } else if (custom.includes(input.source)) {
            mangaArrResult = await this.customSource.mangaList(
                input.source,
                input.page,
            );
        }

        return await this.addDexFieldsToArray(mangaArrResult);
    }

    async manga(input: MangaUniqueInput) {
        let { mangaReader, madara, custom } = SourcesType;
        let resultManga: Manga;

        if (mangaReader.includes(input.source)) {
            let manga = await this.mangaReader.manga(
                input.source as MangaReaderSources,
                input.slug,
            );
            if (!manga) throw new NotFoundException();
            resultManga = manga;
        } else if (madara.includes(input.source)) {
            let manga = await this.madara.manga(
                input.source as MadaraSources,
                input.slug,
            );
            resultManga = manga;
        } else if (custom.includes(input.source)) {
            let manga = await this.customSource.manga(input.source, input.slug);
            resultManga = manga;
        }

        const withDex = await this.addDexFieldsToArray([resultManga]);

        return withDex[0];
    }

    async addDexFieldsToArray(manga: Manga[]) {
        const mangaWithDexFields = await Promise.all(
            manga.map(async (manga) => {
                const { hits } = await this.meili
                    .index("manga")
                    .search(manga.title, { limit: 1 });

                const dexMangaData = hits[0];

                if (!dexMangaData) return manga;

                const neededInfo = {
                    dexId: dexMangaData?.dexId,
                    aniId: dexMangaData?.links.al,
                    muId: dexMangaData?.links.mu,
                    cover: this.mangaReader.genereateImageUrl(
                        `https://mangadex.org/covers/${dexMangaData.dexId}/${
                            dexMangaData?.covers?.[
                                dexMangaData?.covers.length - 1
                            ].fileName
                        }`,
                        "https://mangadex.org/",
                    ),
                    covers: dexMangaData.covers.map((cover) => {
                        return {
                            url: this.mangaReader.genereateImageUrl(
                                `https://mangadex.org/covers/${dexMangaData.dexId}/${cover.fileName}`,
                                "https://mangadex.org/",
                            ),
                            volume: cover.volume,
                        };
                    }),
                };

                return { ...manga, ...neededInfo };
            }),
        );

        return mangaWithDexFields;
    }

    // async addDexFieldsToArray(manga: Manga[]) {
    //     try {
    //         const startDate = Date.now();
    //         const startDateQuery = Date.now();

    //         const mangaWithID: (Manga & { id: string })[] = manga.map((x) => ({
    //             id: "id_" + randomUUID().replace(/\-/g, "_"),
    //             ...x,
    //         }));

    //         const query = `query MangaList {
    //             ${mangaWithID
    //                 .map((manga) => {
    //                     return `${manga.id}: mangaList(searchQuery: "${manga.title}") {
    //                         pageInfo {
    //                           total
    //                           perPage
    //                           currentPage
    //                           lastPage
    //                           hasNextPage
    //                         }
    //                         manga {
    //                             id
    //                             dexId
    //                             covers {
    //                               dexId
    //                               locale
    //                               fileName
    //                               volume
    //                             }
    //                             title {
    //                               en
    //                             }
    //                             altTitles
    //                             description {
    //                               en
    //                             }
    //                             status
    //                             releaseYear
    //                             links {
    //                               nu
    //                               al
    //                               ap
    //                               bw
    //                               kt
    //                               mu
    //                               amz
    //                               cdj
    //                               ebj
    //                               mal
    //                               raw
    //                               engtl
    //                             }
    //                             contentRating
    //                             originalLanguage
    //                             publicationDemographic
    //                           }
    //                       }`;
    //                 })
    //                 .join("\n")}
    //           }`;

    //         const {
    //             data: { data },
    //         } = await axios({
    //             url: "https://easydex-production.up.railway.app/graphql",
    //             method: "POST",
    //             data: {
    //                 operationName: "MangaList",
    //                 query: query,
    //             },
    //         });

    //         console.log("queryTime:", Date.now() - startDateQuery + "ms");

    //         const mangaWithDexFields = mangaWithID.map((manga) => {
    //             const dexData = data[manga.id];

    //             if (dexData && dexData.manga?.length > 0) {
    //                 const dexMangaData = dexData.manga[0];
    //                 if (!dexMangaData) return manga;

    //                 const neededInfo = {
    //                     dexId: dexMangaData?.dexId,
    //                     aniId: dexMangaData?.links.al,
    //                     muId: dexMangaData?.links.mu,
    //                     cover: this.mangaReader.genereateImageUrl(
    //                         `https://mangadex.org/covers/${
    //                             dexMangaData.dexId
    //                         }/${
    //                             dexMangaData?.covers?.[
    //                                 dexMangaData?.covers.length - 1
    //                             ].fileName
    //                         }`,
    //                         "https://mangadex.org/",
    //                     ),
    //                     covers: dexMangaData.covers.map((cover) => {
    //                         return {
    //                             url: this.mangaReader.genereateImageUrl(
    //                                 `https://mangadex.org/covers/${dexMangaData.dexId}/${cover.fileName}`,
    //                                 "https://mangadex.org/",
    //                             ),
    //                             volume: cover.volume
    //                         };
    //                     }),
    //                 };

    //                 return { ...manga, ...neededInfo };
    //             }

    //             return manga;
    //         });

    //         console.log("totalTime:", Date.now() - startDate + "ms");
    //         return mangaWithDexFields;
    //     } catch {
    //         return manga;
    //     }
    // }
}
