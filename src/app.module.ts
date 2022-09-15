import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MangaModule } from "./manga/manga.module";
import { ChaptersModule } from "./chapters/chapters.module";
import { SourcesDataModule } from "./sources/sources-data.module";
import { MangaReaderService } from "./sources/manga-reader/manga-reader.service";
import { MadaraService } from "./sources/madara/madara.service";
import { GenresModule } from "./genres/genres.module";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            introspection: true,
        }),
        MangaModule,
        ChaptersModule,
        SourcesDataModule,
        GenresModule,
    ],
    providers: [MangaReaderService, MadaraService],
})
export class AppModule {}
