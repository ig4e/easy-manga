import { Module } from '@nestjs/common';
import { MadaraService } from './madara/madara.service';
import { MangaReaderService } from './manga-reader/manga-reader.service';
import { SourcesDataService } from './sources-data.service';
import { SourcesDataController } from './sources-data.controller';
import { CustomSourceService } from './custom/custom.service';

@Module({
  providers: [
    CustomSourceService,
    MangaReaderService,
    SourcesDataService,
    MadaraService,
  ],
  controllers: [SourcesDataController],
  exports: [MangaReaderService],
})
export class SourcesDataModule {}
