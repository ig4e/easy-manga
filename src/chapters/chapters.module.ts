import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersResolver } from './chapters.resolver';
import { MangaReaderService } from '../sources-data/manga-reader/manga-reader.service';
import { MangaService } from '.././manga/manga.service';

@Module({
  providers: [ChaptersResolver, ChaptersService, MangaReaderService, MangaService]
})
export class ChaptersModule {}
