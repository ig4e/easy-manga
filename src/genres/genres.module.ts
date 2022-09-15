import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresResolver } from './genres.resolver';
import { MangaReaderService } from "../sources-data/manga-reader/manga-reader.service";

@Module({
  providers: [GenresResolver, GenresService, MangaReaderService]
})
export class GenresModule {}
