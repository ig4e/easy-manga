import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { gotScraping, OptionsOfTextResponseBody, Response } from 'got-scraping';
import { load } from 'cheerio/lib/slim';
import { Sources } from '../../manga/dto/manga.input';
import * as urlHandle from 'url-query-handle';
import { Manga } from 'src/manga/entities/manga.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';

const DEFAULT_SOURCE_SETTINGS: SourceSettings = {
  pathes: { manga: '/manga' },
  selectors: {
    mangaList: {
      list: 'div.listupd > div.bs',
      cover: 'img.wp-post-image',
      url: 'div.bsx > a',
      score: 'div.numscore',
      latestChapterName: 'div.adds > div.epxs',
    },
    manga: {
      title: 'h1.entry-title',
      altTitles: '#titlemove > span.alternative',
      cover: 'div.thumb > img',
      status: 'div.tsinfo.bixbox > div:nth-child(1) > i',
      type: 'div.tsinfo.bixbox > div:nth-child(2) > a',
      author: 'div.tsinfo.bixbox > div:nth-child(3) > i',
      artist: `div.tsinfo.bixbox > div:nth-child(4) > i`,
      releasedAt: '',
      synopsis: `div.entry-content.entry-content-single > p`,
      score: `div.rating.bixbox > div > div.num`,
      genre: "a[rel='tag']",
      chapter: {
        list: '#chapterlist > ul > li',
        url: 'a',
        number: 'li',
        name: 'span.chapternum',
      },
    },
    chapter: {
      name: 'div.headpost > h1.entry-title',
    },
  },
};

const SOURCES: SourcesSettings = {
  ARES: {
    url: 'https://aresmanga.com',
    ...DEFAULT_SOURCE_SETTINGS,
  },
  OZULSCANS: {
    url: 'https://ozulscans.com',
    ...DEFAULT_SOURCE_SETTINGS,
  },
  FLAMESCANS: {
    url: 'https://ar.flamescans.org',
    pathes: { ...DEFAULT_SOURCE_SETTINGS.pathes, manga: '/series' },
    selectors: { ...DEFAULT_SOURCE_SETTINGS.selectors },
  },
  MANGASWAT: {
    url: 'https://swatmanga.me',
    pathes: { ...DEFAULT_SOURCE_SETTINGS.pathes },
    selectors: {
      ...DEFAULT_SOURCE_SETTINGS.selectors,
      manga: {
        title: 'div.infox > h1',
        altTitles: '',
        cover: 'div.thumb > img',
        score: '',
        genre: 'div.infox > div.spe > span:nth-child(1) > a',
        type: `div.infox > div.spe > span:nth-child(4) > a`,
        artist: '',
        author: 'div.infox > div.spe > span:nth-child(3)',
        chapter: {
          list: 'div.bixbox.bxcl > ul',
          name: 'li > span.lchx > a',
          number: '',
          url: 'li > span.lchx > a',
        },
        status: 'div.infox > div.spe > span:nth-child(2)',
        synopsis: `div.infox > div.desc > div > span > p`,
        releasedAt: `div.infox > div.spe > span > time`,
      },
    },
  },
};

type SourcesTypes = 'ARES' | 'FLAMESCANS' | 'MANGASWAT' | 'OZULSCANS';

@Injectable()
export class MangaReaderService {
  constructor() {}
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
      SOURCE.url + SOURCE.pathes.manga,
      mangaListOptions,
    );
    const { body, ok, statusCode, statusMessage } = await gotScraping.get(url, {
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
    } else {
      throw new UnprocessableEntityException(statusCode, statusMessage);
    }

    return results;
  }

  async manga(source: SourcesTypes, slug: string): Promise<Manga> {
    const SOURCE = SOURCES[source];
    const mangaSelectors = SOURCE.selectors.manga;
    const url = SOURCE.url + SOURCE.pathes.manga + `/${slug}`;
    const req = await gotScraping.get(url, {
      dnsCache: true,
    });

    const { body, ok } = await this.get(req.body, {
      dnsCache: true,
    });

    if (ok) {
      const $ = load(body);

      let mangaInfo: Manga = {
        slug,
        url,
        title: $(mangaSelectors.title).text(),
        altTitles:
          $(mangaSelectors.altTitles)
            .text()
            ?.split(/(\,|\|) /g)
            .filter((title) => title.length > 1) || [],
        cover: $(mangaSelectors.cover).attr('src'),
        status: $(mangaSelectors.status).text(),
        type: $(mangaSelectors.type).text(),
        author: $(mangaSelectors.author).text(),
        artist: $(mangaSelectors.artist).text(),
        releasedAt: new Date(),
        synopsis: $(mangaSelectors.synopsis).text(),
        score: Number($(mangaSelectors.score).text()),
        genres: [],
        chapters: [],
      };

      $(mangaSelectors.chapter.list).each((i, el) => {
        const $$ = load(el);
        const url = $$(mangaSelectors.chapter.url).attr('href');
        mangaInfo.chapters.push({
          slug: this.getChapterSlug(source, url),
          url,
          number: Number($$(mangaSelectors.chapter.number).attr('data-num')),
          name: $$(mangaSelectors.chapter.name).text(),
        });
      });

      $(mangaSelectors.genre).each((i, el) => {
        const $$ = load(el);
        mangaInfo.genres.push($$(mangaSelectors.genre).text()?.trim());
      });

      return mangaInfo;
    }
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
    return url
      .replace(SOURCE.url + SOURCE.pathes.manga + '/', '')
      .replace(/\//g, '');
  }

  getChapterNumber(name: string) {
    return Number(name.match(/[0-9]+(\.[0-9])?/g)[0]);
  }
  getChapterSlug(source: SourcesTypes, url: string) {
    const SOURCE = SOURCES[source];
    return url.replace(SOURCE.url, '').replace(/\//g, '');
  }

  async get(body: string, options: any) {
    let cookie = this.solveSucuri(body);
    return await gotScraping.get({
      ...options,
      headers: {
        Cookie: cookie,
      },
    });
  }

  solveSucuri(rawstr: string) {
    const str = rawstr;

    let scriptStart = str.indexOf('<script>') + 8,
      scriptEnd = str.indexOf('</script>');
    let scriptBody = str.substring(scriptStart, scriptEnd);
    let injectedScriptBody = scriptBody.replace(
      "r=''",
      `r="const document = {}, location = { reload: () => document };"`,
    );

    let cookie = eval(injectedScriptBody).cookie;
    console.log(cookie);
    return cookie;
  }
}

export interface MangaListDto {
  'genre[]'?: string[];
  status?: 'ongoing' | 'hiatus' | 'completed';
  type?: 'manga' | 'manhwa' | 'manhua' | 'comic' | 'novel';
  order?: 'title' | 'titlereverse' | 'update' | 'latest' | 'popular';
}

export interface SourcesSettings {
  [index: string]: SourceSettingsWithUrl;
}

interface SourceSettingsWithUrl extends SourceSettings {
  url: string;
}

export interface SourceSettings {
  pathes: {
    manga: string;
  };
  selectors: {
    mangaList: {
      list: string;
      cover: string;
      url: string;
      score: string;
      latestChapterName: string;
    };
    manga: {
      title: string;
      altTitles: string;
      cover: string;
      status: string;
      type: string;
      author: string;
      artist: string;
      releasedAt: string;
      synopsis: string;
      score: string;
      genre: string;
      chapter: {
        list: string;
        url: string;
        number: string;
        name: string;
      };
    };
    chapter: {
      name: string;
    };
  };
}
