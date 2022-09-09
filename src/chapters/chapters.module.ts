import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersResolver } from './chapters.resolver';

@Module({
  providers: [ChaptersResolver, ChaptersService]
})
export class ChaptersModule {}
