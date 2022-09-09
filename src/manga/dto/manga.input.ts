import { Field, InputType, registerEnumType } from '@nestjs/graphql';

@InputType()
export class MangaInput {
  @Field((type) => Sources)
  source: Sources;
}

@InputType()
export class MangaUniqueInput extends MangaInput {
  @Field()
  slug: string;
}

export const SourcesType = {
  mangaReader: ['ARES', 'FLAMESCANS', 'MANGASWAT', 'OZULSCANS'],
  madara: ['MANGALEK', 'MANGASPARK', 'AZORA'],
  custom: ['MANGAAE'],
};

export enum Sources {
  ARES,
  FLAMESCANS,
  MANGALEK,
  MANGASPARK,
  AZORA,
  MANGASWAT,
  MANGAAE,
  OZULSCANS,
}

registerEnumType(Sources, {
  name: 'Sources',
});
