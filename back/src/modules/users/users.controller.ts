import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { LoginUserDto } from "./dto/login-user.dto"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto"
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../common/guards/permissions.guard"
import { RequirePermission } from "../../common/permissions/require-permission.decorator"
import { CurrentUser } from "../../common/decorators/current-user.decorator"
import { RequestUser } from "../../common/auth/jwt.strategy"

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
  @RequirePermission("users", "create")
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission("users", "read")
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission("users", "read")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission("users", "update")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission("users", "delete")
  @Delete(":id")
  disable(@Param("id") id: string) {
    return this.usersService.disable(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission("users", "delete")
  @Patch(":id/enable")
  enable(@Param("id") id: string) {
    return this.usersService.enable(id)
  }
}
