import { Injectable } from '@nestjs/common';
import { MangaReaderService } from '../sources-data/manga-reader/manga-reader.service';

@Injectable()
export class MangaService {
  constructor(private mangaReader: MangaReaderService) {}
  async mangaList() {}
  async manga() {}
}
