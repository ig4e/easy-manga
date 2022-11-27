import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersResolver } from './chapters.resolver';
import { MangaReaderService } from '../sources/manga-reader/manga-reader.service';
import { MangaService } from '.././manga/manga.service';
import { MangaDexService } from '../sources/manga-dex/manga-dex.service';
import { MadaraService } from '../sources/madara/madara.service';
import { CustomSourceService } from '../sources/custom/custom.service';

@Module({
  providers: [ChaptersResolver, ChaptersService, MangaReaderService, MangaService, MangaDexService, MadaraService, CustomSourceService]
})
export class ChaptersModule {}
