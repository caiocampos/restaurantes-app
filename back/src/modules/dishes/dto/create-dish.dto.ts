import {
  IsMongoId,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from "class-validator";

export class CreateDishDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsMongoId()
  restaurant_id!: string;
}
