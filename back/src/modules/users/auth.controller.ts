import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import {
  acceptVisitors,
  visitorUsername,
} from "../../common/permissions/permissions-env";

@Controller("auth")
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    if (acceptVisitors() && dto.username === visitorUsername()) {
      return this.usersService.loginAsVisitor();
    }
    return this.usersService.login(dto);
  }
}
