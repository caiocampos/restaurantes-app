import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { paginate } from '../../common/helpers/paginate';
import { connectionName } from '../../mongoose-connection';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name, connectionName)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  create(dto: CreateRestaurantDto): Promise<RestaurantDocument> {
    return new this.restaurantModel(dto).save();
  }

  findAll(query: PaginationQueryDto): Promise<PaginatedResult<RestaurantDocument>> {
    return paginate(this.restaurantModel, query);
  }

  async findById(id: string): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }
    return restaurant;
  }

  async update(id: string, dto: UpdateRestaurantDto): Promise<RestaurantDocument> {
    const restaurant = await this.findById(id);
    Object.assign(restaurant, dto);
    return restaurant.save();
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const restaurant = await this.findById(id);
    await restaurant.deleteOne();
    return { deleted: true };
  }
}
