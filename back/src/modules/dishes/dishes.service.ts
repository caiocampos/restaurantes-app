import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dish, DishDocument } from './schemas/dish.schema';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { paginate } from '../../common/helpers/paginate';
import { connectionName } from '../../mongoose-connection';
import { Restaurant, RestaurantDocument } from '../restaurants/schemas/restaurant.schema';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish.name, connectionName)
    private readonly dishModel: Model<DishDocument>,
    @InjectModel(Restaurant.name, connectionName)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  private async ensureRestaurantExists(restaurantId: string): Promise<void> {
    const exists = await this.restaurantModel.exists({ _id: restaurantId });
    if (!exists) {
      throw new NotFoundException('Restaurante informado não existe');
    }
  }

  async create(dto: CreateDishDto): Promise<DishDocument> {
    await this.ensureRestaurantExists(dto.restaurant_id);
    return new this.dishModel(dto).save();
  }

  findAll(query: PaginationQueryDto): Promise<PaginatedResult<DishDocument>> {
    return paginate(this.dishModel, query);
  }

  async findById(id: string): Promise<DishDocument> {
    const dish = await this.dishModel.findById(id);
    if (!dish) {
      throw new NotFoundException('Prato não encontrado');
    }
    return dish;
  }

  async update(id: string, dto: UpdateDishDto): Promise<DishDocument> {
    if (dto.restaurant_id) {
      await this.ensureRestaurantExists(dto.restaurant_id);
    }
    const dish = await this.findById(id);
    Object.assign(dish, dto);
    return dish.save();
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const dish = await this.findById(id);
    await dish.deleteOne();
    return { deleted: true };
  }
}
