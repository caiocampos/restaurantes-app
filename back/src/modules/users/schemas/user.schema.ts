import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from "bcrypt";
import { Role } from "../../../common/enums/role.enum";
import { applyToJSONTransform } from "../../../common/utils";

export interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserDocument = User & Document & UserMethods;

const SALT_ROUNDS = 10;

@Schema({ timestamps: true, collection: "users" })
export class User {
  @Prop({ required: true, unique: true, trim: true, index: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({
    required: true,
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role!: Role;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  lastName!: string;

  // Usuários nunca são removidos do banco, apenas desabilitados.
  @Prop({ default: true })
  enabled!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash automático da senha sempre que ela for criada/alterada.
UserSchema.pre("save", async function () {
  const user = this as unknown as UserDocument;
  if (!user.isModified("password")) {
    return;
  }
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
});

UserSchema.methods.comparePassword = function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Nunca expor o hash da senha nas respostas da API.
applyToJSONTransform(UserSchema, ["password"]);
