import { IsString, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsString()
  @MinLength(1)
  address: string;
}
