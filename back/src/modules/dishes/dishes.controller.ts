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
} from "@nestjs/common";
import { DishesService } from "./dishes.service";
import { CreateDishDto } from "./dto/create-dish.dto";
import { UpdateDishDto } from "./dto/update-dish.dto";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermission } from "../../common/permissions/require-permission.decorator";

@Controller("dishes")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @RequirePermission("dishes", "create")
  @Post()
  create(@Body() dto: CreateDishDto) {
    return this.dishesService.create(dto);
  }

  @RequirePermission("dishes", "read")
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.dishesService.findAll(query);
  }

  @RequirePermission("dishes", "read")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dishesService.findById(id);
  }

  @RequirePermission("dishes", "update")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDishDto) {
    return this.dishesService.update(id, dto);
  }

  @RequirePermission("dishes", "delete")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.dishesService.remove(id);
  }
}
