import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { PaginatedResult } from "../../common/interfaces/paginated-result.interface";
import { paginate } from "../../common/helpers/paginate";
import { connectionName } from "../../mongoose-connection";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, connectionName)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ username: dto.username });
    if (existing) {
      throw new ConflictException("Nome de usuário já está em uso");
    }
    const created = new this.userModel(dto);
    return created.save();
  }

  findAll(query: PaginationQueryDto): Promise<PaginatedResult<UserDocument>> {
    return paginate(this.userModel, query);
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.findById(id);
    if (dto.username && dto.username !== user.username) {
      const existing = await this.userModel.findOne({ username: dto.username });
      if (existing) {
        throw new ConflictException("Nome de usuário já está em uso");
      }
    }
    Object.assign(user, dto);
    return user.save();
  }

  async disable(id: string): Promise<UserDocument> {
    const user = await this.findById(id);
    user.enabled = false;
    return user.save();
  }

  async enable(id: string): Promise<UserDocument> {
    const user = await this.findById(id);
    user.enabled = true;
    return user.save();
  }

  async changeOwnPassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ success: true }> {
    const user = await this.findById(userId);
    const isMatch = await user.comparePassword(dto.currentPassword);
    if (!isMatch) {
      throw new UnauthorizedException("Senha atual incorreta");
    }
    user.password = dto.newPassword;
    await user.save();
    return { success: true };
  }

  async login(
    dto: LoginUserDto,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) {
      throw new UnauthorizedException("Usuário ou senha inválidos");
    }
    if (!user.enabled) {
      throw new UnauthorizedException("Usuário desabilitado");
    }
    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) {
      throw new UnauthorizedException("Usuário ou senha inválidos");
    }

    const payload = {
      sub: user.id as string,
      username: user.username,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        username: user.username,
        role: user.role,
        name: user.name,
        lastName: user.lastName,
      },
    };
  }
}
