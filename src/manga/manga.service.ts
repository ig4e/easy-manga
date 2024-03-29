import { Injectable, NotFoundException } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
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
    Order,
    Sources,
    SourcesType,
} from "./dto/manga.input";
import { Manga } from "./entities/manga.entity";
import Fuse from "fuse.js";
import { ratio } from "fuzzball";
import { MeiliService } from "../meili.service";
import * as http from "http";
import * as https from "https";

@Injectable()
export class MangaService {
    axiosClient: AxiosInstance;

    constructor(
        private mangaReader: MangaReaderService,
        private madara: MadaraService,
        private customSource: CustomSourceService,
        private mangaDex: MangaDexService,
        private meili: MeiliService,
    ) {
        this.axiosClient = axios.create({
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ keepAlive: true }),
        });
    }

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
           

            let order: "top" | "new" | "latest" = "top";


            if (input.filters.order === Order.LATEST) order = "new"
            if (input.filters.order === Order.UPDATE) order = "latest"
            if (input.filters.order === Order.POPULAR) order = "top"


            //order: "top" | "new" | "latest"
            mangaArrResult = await this.customSource.mangaList(
                input.source,
                input.page,
                order
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
       // return manga;
        const mangaWithDexFields = await Promise.all(
            manga.map(async (manga) => {
                if (!manga) return manga;

                let atlasStartDate = Date.now();
                const { data } = await axios({
                    method: "POST",
                    url: "https://data.mongodb-api.com/app/data-ykgku/endpoint/data/v1/action/aggregate",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Request-Headers": "*",
                        "api-key":
                            "6kCvNRcJ63IfZ0fyNSNjXn7J1PXy7NLYYx4ovzrfV57V0BSLR8EGotFyuUOXWrm3",
                    },
                    data: {
                        dataSource: "Cluster0",
                        database: "prod",
                        collection: "Manga",
                        pipeline: [
                            {
                                $search: {
                                    index: "default",
                                    compound: {
                                        should: [
                                            {
                                                text: {
                                                    query: manga.title,
                                                    path: "title.en",
                                                    score: {
                                                        boost: {
                                                            value: 2,
                                                        },
                                                    },
                                                },
                                            },
                                            {
                                                text: {
                                                    query: manga.title,
                                                    path: "altTitles",
                                                    score: {
                                                        boost: {
                                                            value: 1.5,
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $limit: 16,
                            },
                        ],
                    },
                });
                let atlasEndDate = Date.now();

                console.log(`Atlas Time : ${atlasEndDate - atlasStartDate}ms`);

                const fuse = new Fuse(data.documents, {
                    keys: ["title.en", "altTitles"],
                });

                const fuseResult = fuse.search(manga.title);

                const dexMangaData = fuseResult?.[0]?.item as any;

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
                    altTitles: dexMangaData.altTitles,
                };

                return { ...manga, ...neededInfo };
            }),
        );

        return mangaWithDexFields.filter((manga) => manga);
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
