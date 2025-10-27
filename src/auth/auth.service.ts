import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { LoginDto } from 'src/models/user/login.dto';
import { UserRegisterDto } from 'src/models/user/user-register.dto';
import { TokenDto } from 'src/models/user/token.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(login: LoginDto): Promise<TokenDto> {
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
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(register: UserRegisterDto) {
    this.logger.log(`Registering user with email ${register.email}`);
    const user: User | null = await this.userService.getUser(register.email);
    if (user) {
      this.logger.error(`User with email ${register.email} already exists`);
      throw new Error('Usuário já existe');
    }
    const hashedPassword = await bcrypt.hash(register.password, 10);
    return this.userService.createUser({
      ...register,
      password: hashedPassword,
    });
  }
}
