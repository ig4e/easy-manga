"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const manga_module_1 = require("./manga/manga.module");
const chapters_module_1 = require("./chapters/chapters.module");
const sources_data_module_1 = require("./sources/sources-data.module");
const manga_reader_service_1 = require("./sources/manga-reader/manga-reader.service");
const madara_service_1 = require("./sources/madara/madara.service");
const genres_module_1 = require("./genres/genres.module");
const apollo_server_plugin_response_cache_1 = __importDefault(require("apollo-server-plugin-response-cache"));
const cacheControl_1 = require("apollo-server-core/dist/plugin/cacheControl");
const app_controller_1 = require("./app.controller");
const meili_service_1 = require("./meili.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: true,
                introspection: true,
                cache: "bounded",
                plugins: [
                    (0, cacheControl_1.ApolloServerPluginCacheControl)({ defaultMaxAge: 30 }),
                    (0, apollo_server_plugin_response_cache_1.default)(),
                ],
            }),
            manga_module_1.MangaModule,
            chapters_module_1.ChaptersModule,
            sources_data_module_1.SourcesDataModule,
            genres_module_1.GenresModule,
        ],
        providers: [manga_reader_service_1.MangaReaderService, madara_service_1.MadaraService, meili_service_1.MeiliService],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map