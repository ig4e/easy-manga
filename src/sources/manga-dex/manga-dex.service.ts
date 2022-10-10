import { Injectable } from "@nestjs/common";
import { gotScraping } from "got-scraping";
import Fuse from "fuse.js";

const gotInstance = gotScraping.extend({
    cache: true,
    cacheOptions: {
        shared: true,
    },
    dnsCache: true,
});

@Injectable()
export class MangaDexService {
    async search(query: string) {
        try {
            let { body }: { body: any } = await gotInstance(
                `https://api.mangadex.org/manga?limit=16&offset=0&includes[]=cover_art&includes[]=author&includes[]=artist&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=${encodeURIComponent(
                    query,
                )}&order[relevance]=desc`,
                { responseType: "json" },
            );

            //console.log(body);
            const fuse = new Fuse(body.data, {
                keys: [
                    "attributes.title.en",
                    "attributes.altTitles.en",
                    "attributes.altTitles.ja-ro",
                    "attributes.altTitles.zh-ro",
                    "attributes.altTitles.ko-ro",
                ],
                includeScore: true,
            });

            return fuse.search(query)?.[0]?.item;
        } catch {
            return await this.search(query);
        }
    }
}
