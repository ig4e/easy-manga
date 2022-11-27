import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaResolver } from './manga.resolver';
import { MangaDexService } from "../sources/manga-dex/manga-dex.service";
import { MangaReaderService } from '../sources/manga-reader/manga-reader.service';
import { MadaraService } from '../sources/madara/madara.service';

@Module({
  providers: [
    MadaraService,
    MangaResolver,
    MangaService,
    MangaReaderService,
    MangaDexService
  ],
})
export class MangaModule {}
