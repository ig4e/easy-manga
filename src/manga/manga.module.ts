import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaResolver } from './manga.resolver';

import { MangaReaderService } from '../sources/manga-reader/manga-reader.service';

@Module({
  providers: [
    MangaResolver,
    MangaService,
    MangaReaderService
  ],
})
export class MangaModule {}
