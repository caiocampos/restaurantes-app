import { Controller, Get } from "@nestjs/common";
import { RestaurantsService } from "./restaurants.service";

@Controller("restaurants-open")
export class RestaurantsOpenController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get("count")
  count(): Promise<number> {
    return this.restaurantsService.count();
  }
}
