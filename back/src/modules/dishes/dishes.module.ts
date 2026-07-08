import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dish, DishSchema } from './schemas/dish.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { connectionName } from '../../mongoose-connection';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Dish.name, schema: DishSchema },
        { name: Restaurant.name, schema: RestaurantSchema },
      ],
      connectionName,
    ),
  ],
  controllers: [DishesController],
  providers: [DishesService],
  exports: [DishesService],
})
export class DishesModule {}
