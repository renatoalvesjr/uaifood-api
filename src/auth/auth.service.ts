import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { LoginDto } from 'src/user/dto/login.dto';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { TokenDto } from 'src/user/dto/token.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    login: LoginDto,
    res?: import('express').Response,
  ): Promise<TokenDto> {
    const user: User | null = await this.userService.getUser(login.email);
    this.logger.log(`Atempting to login with email ${login.email}`);
    if (!user) {
      this.logger.error(`Couldn't find user with email ${login.email}`);
      throw new Error('Usuário não encontrado');
    }
    if (
      !(await this.userService.checkPassword(login.password, user.password))
    ) {
      this.logger.error(`Invalid password for user with email ${login.email}`);
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    this.logger.log(`Login successful for user with email ${login.email}`);
    const token = await this.jwtService.signAsync(payload);

    // If an Express response object was provided, set the cookie as HttpOnly
    if (res) {
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    }

    return {
      access_token: token,
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
    const payload = { sub: createdUser.id, email: createdUser.email };
    this.logger.log(`User with email ${register.email} registered`);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
