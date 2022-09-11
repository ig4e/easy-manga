import { Module } from '@nestjs/common';
import { MadaraService } from './madara/madara.service';
import { MangaReaderService } from './manga-reader/manga-reader.service';
import { SourcesDataService } from './sources-data.service';
import { SourcesDataController } from './sources-data.controller';

@Module({
  providers: [
    MangaReaderService,
    SourcesDataService,
    MadaraService,
  ],
  controllers: [SourcesDataController],
  exports: [MangaReaderService],
})
export class SourcesDataModule {}
