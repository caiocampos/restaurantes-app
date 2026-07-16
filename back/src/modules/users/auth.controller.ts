import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { LoginUserDto } from "./dto/login-user.dto"
import { RequestUser } from "../../common/auth/jwt.strategy"
import { CurrentUser } from "../../common/decorators/current-user.decorator"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard"

@Controller("auth")
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @CurrentUser() currentUser: RequestUser,
    @Body() dto: RefreshTokenDto
  ) {
    return this.usersService.refreshToken(currentUser, dto)
  }
}
