import { Controller, Get } from "@nestjs/common";

@Controller("app")
export class AppController {
    @Get("/")
    ok() {
        return 200;
    }
}
