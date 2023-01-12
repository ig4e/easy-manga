"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sources = exports.SourcesType = exports.MangalistInput = exports.Order = exports.Type = exports.Status = exports.MangaListFilters = exports.MangaSearchInput = exports.MangaUniqueInput = exports.BaseInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let BaseInput = class BaseInput {
};
__decorate([
    (0, graphql_1.Field)((type) => Sources, { defaultValue: "MANGAKAKALOT" }),
    __metadata("design:type", String)
], BaseInput.prototype, "source", void 0);
BaseInput = __decorate([
    (0, graphql_1.InputType)()
], BaseInput);
exports.BaseInput = BaseInput;
let MangaUniqueInput = class MangaUniqueInput extends BaseInput {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MangaUniqueInput.prototype, "slug", void 0);
MangaUniqueInput = __decorate([
    (0, graphql_1.InputType)()
], MangaUniqueInput);
exports.MangaUniqueInput = MangaUniqueInput;
let MangaSearchInput = class MangaSearchInput extends BaseInput {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MangaSearchInput.prototype, "query", void 0);
MangaSearchInput = __decorate([
    (0, graphql_1.InputType)()
], MangaSearchInput);
exports.MangaSearchInput = MangaSearchInput;
let MangaListFilters = class MangaListFilters {
};
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], MangaListFilters.prototype, "genre", void 0);
__decorate([
    (0, graphql_1.Field)(() => Status, { nullable: true }),
    __metadata("design:type", String)
], MangaListFilters.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => Type, { nullable: true }),
    __metadata("design:type", String)
], MangaListFilters.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => Order, { nullable: true }),
    __metadata("design:type", String)
], MangaListFilters.prototype, "order", void 0);
MangaListFilters = __decorate([
    (0, graphql_1.InputType)()
], MangaListFilters);
exports.MangaListFilters = MangaListFilters;
var Status;
(function (Status) {
    Status["ONGOING"] = "ongoing";
    Status["HIATUS"] = "hiatus";
    Status["COMPLETED"] = "completed";
})(Status = exports.Status || (exports.Status = {}));
var Type;
(function (Type) {
    Type["MANGA"] = "manga";
    Type["MANHWA"] = "manhwa";
    Type["MANHUA"] = "manhua";
    Type["COMIC"] = "comic";
    Type["NOVEL"] = "novel";
})(Type = exports.Type || (exports.Type = {}));
var Order;
(function (Order) {
    Order["TITLE"] = "title";
    Order["TITLEREVERSE"] = "titlereverse";
    Order["UPDATE"] = "update";
    Order["LATEST"] = "latest";
    Order["POPULAR"] = "popular";
})(Order = exports.Order || (exports.Order = {}));
(0, graphql_1.registerEnumType)(Status, {
    name: "Status",
});
(0, graphql_1.registerEnumType)(Type, {
    name: "Type",
});
(0, graphql_1.registerEnumType)(Order, {
    name: "Order",
});
let MangalistInput = class MangalistInput extends BaseInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MangalistInput.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)(() => MangaListFilters, { nullable: true }),
    __metadata("design:type", MangaListFilters)
], MangalistInput.prototype, "filters", void 0);
MangalistInput = __decorate([
    (0, graphql_1.InputType)()
], MangalistInput);
exports.MangalistInput = MangalistInput;
exports.SourcesType = {
    mangaReader: [
        "ARES",
        "GALAXYMANGA",
        "MANGASWAT",
        "OZULSCANS",
        "ARENASCANS",
    ],
    madara: [
        "MANGALEK",
        "MANGASPARK",
        "AZORA",
        "STKISSMANGA",
        "MANGAPROTM",
        "ASHQ",
    ],
    custom: ["MANGAAE", "TEAMX", "KISSMANGA", "MANGAKAKALOT"],
};
var Sources;
(function (Sources) {
    Sources["ARES"] = "ARES";
    Sources["GALAXYMANGA"] = "GALAXYMANGA";
    Sources["MANGALEK"] = "MANGALEK";
    Sources["MANGASPARK"] = "MANGASPARK";
    Sources["AZORA"] = "AZORA";
    Sources["MANGASWAT"] = "MANGASWAT";
    Sources["MANGAAE"] = "MANGAAE";
    Sources["OZULSCANS"] = "OZULSCANS";
    Sources["TEAMX"] = "TEAMX";
    Sources["STKISSMANGA"] = "STKISSMANGA";
    Sources["KISSMANGA"] = "KISSMANGA";
    Sources["MANGAPROTM"] = "MANGAPROTM";
    Sources["ARENASCANS"] = "ARENASCANS";
    Sources["ASHQ"] = "ASHQ";
    Sources["MANGAKAKALOT"] = "MANGAKAKALOT";
})(Sources = exports.Sources || (exports.Sources = {}));
(0, graphql_1.registerEnumType)(Sources, {
    name: "Sources",
});
//# sourceMappingURL=manga.input.js.map