import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { $Enums, User } from 'generated/prisma';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { TokenDto } from 'src/user/dto/token.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

export interface SanitizedUser {
  name: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  type: $Enums.UserType;
  email: string;
  phone: string | null;
  addressId: number | null;
}
@Injectable()
export class AuthService {
  logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<SanitizedUser | null> {
    const user: User | null = await this.userService.getUser(email);
    if (
      user &&
      (await this.userService.checkPassword(password, user.password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(login: SanitizedUser) {
    const payload = { sub: login.id, email: login.email, roles: login.type };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(register: UserRegisterDto): Promise<TokenDto> {
    this.logger.log(`Registering user with email ${register.email}`);
    const user: User | null = await this.userService.getUser(register.email);
    if (user) {
      this.logger.error(`User with email ${register.email} already exists`);
      throw new Error('Usuário já existe');
    }
    const hashedPassword = await bcrypt.hash(register.password, 10);
    const createdUser = await this.userService.createUser({
      ...register,
      password: hashedPassword,
    });
    if (!createdUser) {
      this.logger.error(`Couldn't create user with email ${register.email}`);
      throw new Error('Erro ao criar usuário');
    }
    const payload = {
      sub: createdUser.id,
      email: createdUser.email,
      roles: createdUser.type,
    };
    this.logger.log(`User with email ${register.email} registered`);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
