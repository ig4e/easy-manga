import { Injectable } from '@nestjs/common';
import { gotScraping } from 'got-scraping';
import { load } from 'cheerio/lib/slim';
import { Sources } from '../../manga/dto/manga.input';
import * as urlHandle from 'url-query-handle';
import { Manga } from 'src/manga/entities/manga.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { MangaSwatService } from '../../sources/manga-swat/manga-swat.service';

const SOURCES = {
  ARES: { url: 'https://aresmanga.com', manga: '/manga' },
  FLAMESCANS: { url: 'https://ar.flamescans.org', manga: '/series' },
  MANGASWAT: { url: 'https://swatmanga.me', manga: '/manga' },
  OZULSCANS: { url: 'https://ozulscans.com', manga: '/manga' },
};
type SourcesTypes = 'ARES' | 'FLAMESCANS' | 'MANGASWAT' | 'OZULSCANS';

@Injectable()
export class MangaReaderService {
  constructor(private mangaSwatService: MangaSwatService) {}
  async search(source: SourcesTypes, query: string): Promise<Manga[]> {
    const { body }: { body: any } = await gotScraping.post(
      SOURCES[source].url + `/wp-admin/admin-ajax.php`,
      {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: 'action=ts_ac_do_search&ts_ac_query=' + encodeURIComponent(query),
      },
    );
    const all = JSON.parse(body).series[0].all;
    return all.map((e) => {
      let manga: Manga = {
        slug: this.getMangaSlug(source, e.post_link),
        url: e.post_link,
        title: e.post_title,
        cover: e.post_image,
        altTitles: [],
        genres: e.post_genres.split(', '),
        score: 0,
        chapters: [
          {
            slug: '',
            url: '',
            name: e.post_latest,
            number: this.getChapterNumber(e.post_latest),
          },
        ],
      };
      return manga;
    });
  }
  async mangaList(
    source: SourcesTypes,
    mangaListOptions: MangaListDto,
  ): Promise<Manga[]> {
    const SOURCE = SOURCES[source];
    const results: Manga[] = [];
    const url = urlHandle.addMultipleParams(
      SOURCE.url + SOURCE.manga,
      mangaListOptions,
    );
    const { body, ok } = await gotScraping.get(url, {
      dnsCache: true,
    });

    if (ok) {
      const $ = load(body);
      $(`div.listupd > div.bs`).each((i, el) => {
        const $$ = load(el);
        const a = $$('div.bsx > a');
        const title = a.attr('title');
        if (title.includes('Novel')) return;
        const url = a.attr('href');
        const slug = this.getMangaSlug(source, url);
        const chapterName = $$(`div.adds > div.epxs`).text()?.trim();
        const chapterNumber = this.getChapterNumber(chapterName);
        results.push({
          slug,
          url,
          title,
          cover: $$(`img.wp-post-image`).attr('src'),
          altTitles: [],
          genres: [],
          score: Number($$(`div.numscore`).text()?.trim()) ?? 0,
          chapters: [
            {
              url: '',
              slug: '',
              name: chapterName,
              number: chapterNumber,
            },
          ],
        });
      });
    }

    return results;
  }

  async manga(source: SourcesTypes, slug: string): Promise<Manga> {
    const SOURCE = SOURCES[source];
    const url = SOURCE.url + SOURCE.manga + `/${slug}`;
    const { body, ok } = await gotScraping.get(url, {
      dnsCache: true,
    });

    if (ok) {
      if ('MANGASWAT' === source)
        return await this.mangaSwatService.manga(url, slug, body);
      return await this.defaultMangaReaderManga(source, url, slug, body);
    }
  }

  async defaultMangaReaderManga(
    source: SourcesTypes,
    url: string,
    slug: string,
    body: string,
  ) {
    const $ = load(body);

    let mangaInfo: Manga = {
      slug,
      url,
      title: $(`h1.entry-title`).text(),
      altTitles:
        $(`#titlemove > span.alternative`)
          .text()
          ?.split(/(\,|\|) /g)
          .filter((title) => title.length > 1) || [],
      cover: $(`div.thumb > img`).attr('src'),
      status: $(`div.tsinfo.bixbox > div:nth-child(1) > i`).text(),
      type: $(`div.tsinfo.bixbox > div:nth-child(2) > a`).text(),
      author: $(`div.tsinfo.bixbox > div:nth-child(3) > i`).text(),
      artist: $(`div.tsinfo.bixbox > div:nth-child(4) > i`).text(),
      releasedAt: new Date(),
      synopsis: $(`div.entry-content.entry-content-single > p`).text(),
      score: Number($(`div.rating.bixbox > div > div.num`).text()),
      genres: [],
      chapters: [],
    };

    $(`#chapterlist > ul > li`).each((i, el) => {
      const $$ = load(el);
      const url = $$(`a`).attr('href');
      mangaInfo.chapters.push({
        slug: this.getChapterSlug(source, url),
        url,
        number: Number($$(`li`).attr('data-num')),
        name: $$(`span.chapternum`).text(),
      });
    });

    $(`a[rel='tag']`).each((i, el) => {
      const $$ = load(el);
      mangaInfo.genres.push($$('a').text()?.trim());
    });

    return mangaInfo;
  }

  async chapter(source: SourcesTypes, slug: string) {
    const SOURCE = SOURCES[source];
    const url = SOURCE.url + `/${slug}`;
    const { body, ok } = await gotScraping.get(url, {
      dnsCache: true,
    });

    if (ok) {
      const $ = load(body);
      const name = $(`div.headpost > h1.entry-title`).text();
      const chapter: Chapter = {
        url,
        slug: this.getChapterSlug(source, url),
        name: name,
        number: this.getChapterNumber(name),
        nextSlug: '',
        prevSlug: '',
        pages: [],
      };

      let chapterData = JSON.parse(
        body.match(/ts\_reader.run\({.+\}/m)[0].replace('ts_reader.run(', ''),
      );

      chapter.prevSlug = this.getChapterSlug(source, chapterData.prevUrl);
      chapter.nextSlug = this.getChapterSlug(source, chapterData.nextUrl);
      chapter.pages = chapterData.sources[0].images;

      return chapter;
    } else {
    }
  }

  getMangaSlug(source: SourcesTypes, url: string) {
    const SOURCE = SOURCES[source];
    return url.replace(SOURCE.url + SOURCE.manga + '/', '').replace(/\//g, '');
  }

  getChapterNumber(name: string) {
    return Number(name.match(/[0-9]+(\.[0-9])?/g)[0]);
  }
  getChapterSlug(source: SourcesTypes, url: string) {
    const SOURCE = SOURCES[source];
    return url.replace(SOURCE.url, '').replace(/\//g, '');
  }
}

export interface MangaListDto {
  'genre[]'?: string[];
  status?: 'ongoing' | 'hiatus' | 'completed';
  type?: 'manga' | 'manhwa' | 'manhua' | 'comic' | 'novel';
  order?: 'title' | 'titlereverse' | 'update' | 'latest' | 'popular';
}
