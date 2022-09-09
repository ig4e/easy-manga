import { Injectable } from '@nestjs/common';
import { load } from 'cheerio/lib/slim';
import { Manga } from 'src/manga/entities/manga.entity';
import {
  MangaListDto,
  MangaReaderService,
} from '../../sources-data/manga-reader/manga-reader.service';

@Injectable()
export class MangaSwatService {
  async manga(url: string, slug: string, body: string) {
    const $ = load(body);

    let mangaInfo: Manga = {
      slug,
      url,
      title: $(`div.bigcontent > div.infox > h1`).text(),
      altTitles: [],
      cover: $(`div.thumb > img`).attr('src'),
      status: $(`div.infox > div.spe > span:nth-child(2)`)
        .text()
        ?.replace('الحالة:', '')
        .trim(),
      type: $(`div.infox > div.spe > span:nth-child(3) > a`).text(),
      author: $(`div.tsinfo.bixbox > div:nth-child(3) > i`).text(),
      artist: $(`div.tsinfo.bixbox > div:nth-child(4) > i`).text(),
      releasedAt: new Date(),
      synopsis: $(`div.infox > div.desc > div > span > p`).text(),
      score: Number($(`div.rating.bixbox > div > div.num`).text()),
      genres: [],
      chapters: [],
    };

    $(`div.bixbox.bxcl > ul > li`).each((i, el) => {
      const $$ = load(el);
      const url = $$(`a`).attr('href');
      const chapterName = $$(`span.lchx > a`).text()?.trim();
      mangaInfo.chapters.push({
        slug: this.getChapterSlug(url),
        url,
        name: chapterName,
        number: this.getChapterNumber(chapterName),
      });
    });

    $(`div.infox > div.spe > span:nth-child(1) > a`).each((i, el) => {
      const $$ = load(el);
      mangaInfo.genres.push($$('a').text()?.trim());
    });

    return mangaInfo;
  }

  getChapterSlug(url: string) {
    return url.replace('https://swatmanga.me/', '').replace(/\//g, '');
  }
  getChapterNumber(name: string) {
    return Number(name.match(/[0-9]+(\.[0-9])?/g)[0]);
  }
}
