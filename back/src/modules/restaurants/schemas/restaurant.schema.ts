import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { applyToJSONTransform } from "../../../common/utils"

export type RestaurantDocument = Restaurant & Document

@Schema({ timestamps: true, collection: "restaurants" })
export class Restaurant {
  @Prop({ required: true, trim: true, index: true })
  name!: string

  @Prop({ required: true, trim: true })
  phone!: string

  @Prop({ required: true, trim: true })
  address!: string
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant)

applyToJSONTransform(RestaurantSchema)
