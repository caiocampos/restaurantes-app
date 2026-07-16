import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { JwtService } from "@nestjs/jwt"
import { Model } from "mongoose"
import ms from "ms"
import { User, UserDocument } from "./schemas/user.schema"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { LoginUserDto } from "./dto/login-user.dto"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto"
import { PaginatedResult } from "../../common/interfaces/paginated-result.interface"
import { paginate } from "../../common/helpers/paginate"
import { connectionName } from "../../mongoose-connection"
import { Role } from "../../common/enums/role.enum"
import {
  acceptVisitors,
  visitorUsername,
} from "../../common/permissions/permissions-env"
import {
  getjwtExpiresIn,
  getjwtExpiresInRefresh,
  getjwtSecret,
  getjwtSecretRefresh,
} from "../../common/auth/jwt-env"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { JwtPayload, RequestUser } from "../../common/auth/jwt.strategy"

interface GenTokenPayload {
  id: string
  username: string
  role: Role
}

const conflictError = "Nome de usuário já está em uso"
const notFoundError = "Usuário não encontrado"
const userOrPassError = "Usuário ou senha inválidos"

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectModel(User.name, connectionName)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    if (dto.username === visitorUsername()) {
      throw new ConflictException("O username não pode ser usado")
    }
    const existing = await this.userModel.findOne({ username: dto.username })
    if (existing) {
      throw new ConflictException(conflictError)
    }
    const created = new this.userModel(dto)
    return created.save()
  }

  findAll(query: PaginationQueryDto): Promise<PaginatedResult<UserDocument>> {
    return paginate(this.userModel, query)
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException(notFoundError)
    }
    return user
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.findById(id)
    if (dto.username && dto.username !== user.username) {
      const existing = await this.userModel.findOne({ username: dto.username })
      if (existing) {
        throw new ConflictException(conflictError)
      }
    }
    Object.assign(user, dto)
    return user.save()
  }

  async disable(id: string): Promise<UserDocument> {
    const user = await this.findById(id)
    user.enabled = false
    return user.save()
  }

  async enable(id: string): Promise<UserDocument> {
    const user = await this.findById(id)
    user.enabled = true
    return user.save()
  }

  async changeOwnPassword(
    userId: string,
    dto: ChangePasswordDto
  ): Promise<{ success: true }> {
    const user = await this.findById(userId)
    const isMatch = await user.comparePassword(dto.currentPassword)
    if (!isMatch) {
      throw new UnauthorizedException("Senha atual incorreta")
    }
    user.password = dto.newPassword
    await user.save()
    return { success: true }
  }

  async login(dto: LoginUserDto): Promise<{
    accessToken: string
    refreshToken: string
    user: Partial<User>
  }> {
    if (acceptVisitors() && dto.username === visitorUsername()) {
      if (dto.password !== visitorUsername()) {
        throw new UnauthorizedException(userOrPassError)
      }
      return this.loginAsVisitor()
    }
    const user = await this.userModel.findOne({ username: dto.username })
    if (!user) {
      throw new UnauthorizedException(userOrPassError)
    }
    if (!user.enabled) {
      throw new UnauthorizedException("Usuário desabilitado")
    }
    const isMatch = await user.comparePassword(dto.password)
    if (!isMatch) {
      throw new UnauthorizedException(userOrPassError)
    }
    return {
      ...(await this.generateTokens(user)),
      user: {
        username: user.username,
        role: user.role,
        name: user.name,
        lastName: user.lastName,
      },
    }
  }

  async refreshToken(
    currentUser: RequestUser,
    dto: RefreshTokenDto
  ): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    if (acceptVisitors() && currentUser.username === visitorUsername()) {
      const { accessToken, refreshToken } = await this.loginAsVisitor()
      return { accessToken, refreshToken }
    }
    const user = await this.checkRefreshToken(currentUser, dto)
    return this.generateTokens(user)
  }

  protected async checkRefreshToken(
    currentUser: RequestUser,
    dto: RefreshTokenDto
  ): Promise<GenTokenPayload> {
    const id = this.jwtService.decode<JwtPayload>(dto.refreshToken)["sub"]
    if (id !== currentUser.userId) {
      this.logger.error("O usuário não é compatível com a requisição")
      throw new NotFoundException(notFoundError)
    }
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException(notFoundError)
    }
    try {
      this.jwtService.verify(dto.refreshToken, {
        secret: getjwtSecretRefresh(),
      })
      return user
    } catch (error: unknown) {
      const err = error as Error
      this.logger.error("Erro ao validar o token", error)
      if (err.name === "JsonWebTokenError") {
        throw new UnauthorizedException("Assinatura Inválida")
      }
      if (err.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token Expirado")
      }
      throw new UnauthorizedException(err.name)
    }
  }

  protected async loginAsVisitor(): Promise<{
    accessToken: string
    refreshToken: string
    user: Partial<User>
  }> {
    const username = visitorUsername()
    const role = Role.VISITOR
    return {
      ...(await this.generateTokens({
        id: username,
        username,
        role,
      })),
      user: {
        username,
        role,
        name: username,
        lastName: username,
      },
    }
  }

  protected async generateTokens(
    user: GenTokenPayload
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    }
  }

  protected async generateAccessToken(user: GenTokenPayload): Promise<string> {
    const options = {
      secret: getjwtSecret(),
      expiresIn: getjwtExpiresIn(),
    }
    return this.generateToken(user, options)
  }

  protected async generateRefreshToken(user: GenTokenPayload): Promise<string> {
    const options = {
      secret: getjwtSecretRefresh(),
      expiresIn: getjwtExpiresInRefresh(),
    }
    return this.generateToken(user, options)
  }

  protected async generateToken(
    user: GenTokenPayload,
    options: {
      secret: string
      expiresIn: ms.StringValue
    }
  ): Promise<string> {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    }
    const token = await this.jwtService.signAsync(payload, options)

    return token
  }
}
