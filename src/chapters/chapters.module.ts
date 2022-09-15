import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersResolver } from './chapters.resolver';
import { MangaReaderService } from '../sources/manga-reader/manga-reader.service';
import { MangaService } from '.././manga/manga.service';
import { MangaDexService } from '../sources/manga-dex/manga-dex.service';

@Module({
  providers: [ChaptersResolver, ChaptersService, MangaReaderService, MangaService, MangaDexService]
})
export class ChaptersModule {}
