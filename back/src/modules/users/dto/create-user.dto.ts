import { IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  lastName: string;
}
