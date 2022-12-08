import { Injectable, } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class MeiliService extends MeiliSearch {
  constructor() {
    super({
      host: 'https://meilisearch-production-d30d.up.railway.app',
      apiKey: 'admin1234',
    });
  }

}
