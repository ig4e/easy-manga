import { Module } from '@nestjs/common';
import { MangaSwatService } from './manga-swat.service';
import { MangaReaderService } from '../../sources-data/manga-reader/manga-reader.service';

@Module({
  providers: [MangaSwatService, MangaReaderService],
  exports: [MangaSwatService]
})
export class MangaSwatModule {}
