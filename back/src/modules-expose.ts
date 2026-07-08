import { DynamicModule, ForwardReference, Type } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./common/auth/auth.module";
import { DishesModule } from "./modules/dishes/dishes.module";
import { RestaurantsModule } from "./modules/restaurants/restaurants.module";
import { UsersModule } from "./modules/users/users.module";
import { connectionName } from "./mongoose-connection";
import { forceString } from "./common/utils";

export const moduleList: (
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>
)[] = [
  MongooseModule.forRoot(
    forceString(process.env.MONGO_URI_RESTAURANTS ?? process.env.MONGO_URI),
    { connectionName },
  ),
  AuthModule,
  DishesModule,
  RestaurantsModule,
  UsersModule,
];
