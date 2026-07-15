import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { RestaurantsService } from "./restaurants.service"
import { CreateRestaurantDto } from "./dto/create-restaurant.dto"
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto"
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto"
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../common/guards/permissions.guard"
import { RequirePermission } from "../../common/permissions/require-permission.decorator"

@Controller("restaurants")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @RequirePermission("restaurants", "create")
  @Post()
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto)
  }

  @RequirePermission("restaurants", "read")
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.restaurantsService.findAll(query)
  }

  @RequirePermission("restaurants", "read")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.restaurantsService.findById(id)
  }

  @RequirePermission("restaurants", "update")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, dto)
  }

  @RequirePermission("restaurants", "delete")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.restaurantsService.remove(id)
  }
}
