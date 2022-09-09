import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaResolver } from './manga.resolver';

import { MangaSwatService } from '../sources/manga-swat/manga-swat.service';
import { MangaReaderService } from '../sources-data/manga-reader/manga-reader.service';

@Module({
  providers: [
    MangaResolver,
    MangaService,
    MangaSwatService,
    MangaReaderService
  ],
})
export class MangaModule {}
