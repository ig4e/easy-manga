import { Controller, Get, Query } from '@nestjs/common';
import { MangaListFilters } from '../manga/dto/manga.input';
import {
  MangaReaderService,
} from './manga-reader/manga-reader.service';

@Controller('sources-data')
export class SourcesDataController {
  constructor(private mangaReader: MangaReaderService) {}
  @Get('/search')
  async search(
    @Query('source') source: 'ARES' | 'FLAMESCANS' | 'MANGASWAT' | 'OZULSCANS',
    @Query('query') query: string,
  ) {
    return this.mangaReader.search(source, query);
  }

  @Get('/manga-list')
  async mangaList(
    @Query('source') source: 'ARES' | 'FLAMESCANS' | 'MANGASWAT' | 'OZULSCANS',
    @Query() filters: MangaListFilters,
  ) {
    return this.mangaReader.mangaList(source, filters);
  }

  @Get('/manga')
  async manga(
    @Query('source') source: 'ARES' | 'FLAMESCANS' | 'MANGASWAT' | 'OZULSCANS',
    @Query('slug') slug: string,
  ) {
    return this.mangaReader.manga(source, slug);
  }

  @Get('/chapter')
  async chapter(
    @Query('source') source: 'ARES' | 'FLAMESCANS' | 'MANGASWAT' | 'OZULSCANS',
    @Query('slug') slug: string,
  ) {
    return this.mangaReader.chapter(source, slug);
  }
}
