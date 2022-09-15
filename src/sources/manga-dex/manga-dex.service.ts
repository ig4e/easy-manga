import { Injectable } from "@nestjs/common";
import { gotScraping } from "got-scraping";
import Fuse from "fuse.js";

@Injectable()
export class MangaDexService {
    async search(query: string) {
        let { body }: { body: any } = await gotScraping(
            `https://api.mangadex.org/manga?limit=32&offset=0&includes[]=cover_art&includes[]=author&includes[]=artist&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=${encodeURIComponent(
                query,
            )}&order[relevance]=desc`,
            { responseType: "json" },
        );

        //console.log(body);
        const fuse = new Fuse(body.data, {
            keys: ["attributes.title.en", "attributes.altTitles.en"],
            includeScore: true,
        });

        return fuse.search(query)?.[0]?.item;
    }
}
