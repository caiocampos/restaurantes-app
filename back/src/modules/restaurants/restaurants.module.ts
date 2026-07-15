import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Restaurant, RestaurantSchema } from "./schemas/restaurant.schema"
import { RestaurantsController } from "./restaurants.controller"
import { RestaurantsService } from "./restaurants.service"
import { connectionName } from "../../mongoose-connection"
import { RestaurantsOpenController } from "./restaurants-open.controller"

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Restaurant.name, schema: RestaurantSchema }],
      connectionName
    ),
  ],
  controllers: [RestaurantsController, RestaurantsOpenController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
