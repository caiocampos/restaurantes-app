import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { applyToJSONTransform } from "../../../common/utils";

export type DishDocument = Dish & Document;

@Schema({ timestamps: true, collection: "dishes" })
export class Dish {
  @Prop({ required: true, trim: true, index: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({
    type: Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true,
  })
  restaurant_id!: Types.ObjectId;
}

export const DishSchema = SchemaFactory.createForClass(Dish);

applyToJSONTransform(DishSchema);
