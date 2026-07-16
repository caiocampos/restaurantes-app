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
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto"
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../common/guards/permissions.guard"
import { RequirePermission } from "../../common/permissions/require-permission.decorator"
import { CurrentUser } from "../../common/decorators/current-user.decorator"
import { RequestUser } from "../../common/auth/jwt.strategy"
import {
  ActionEnum,
  ModuleNameEnum,
} from "../../common/permissions/permissions.matrix"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getOwnProfile(@CurrentUser() currentUser: RequestUser) {
    return this.usersService.findById(currentUser.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me/password")
  changeOwnPassword(
    @CurrentUser() currentUser: RequestUser,
    @Body() dto: ChangePasswordDto
  ) {
    return this.usersService.changeOwnPassword(currentUser.userId, dto)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(ModuleNameEnum.USERS, ActionEnum.CREATE)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(ModuleNameEnum.USERS, ActionEnum.READ)
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(ModuleNameEnum.USERS, ActionEnum.READ)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(ModuleNameEnum.USERS, ActionEnum.UPDATE)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(ModuleNameEnum.USERS, ActionEnum.DELETE)
  @Delete(":id")
  disable(@Param("id") id: string) {
    return this.usersService.disable(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(ModuleNameEnum.USERS, ActionEnum.DELETE)
  @Patch(":id/enable")
  enable(@Param("id") id: string) {
    return this.usersService.enable(id)
  }
}
