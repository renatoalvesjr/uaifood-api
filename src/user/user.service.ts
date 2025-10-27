import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/psirma.service';
import * as bcrypt from 'bcrypt';
import { UserRegisterDto } from 'src/models/user/user-register.dto';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
  logger: Logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUser(email: string): Promise<User | null> {
    this.logger.log(`Getting user with email ${email}`);

    if (await this.userExists(email)) {
      this.logger.log(`User with email ${email} found`);
      throw new Error('Usuário já existe');
    }

    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  createUser(register: UserRegisterDto) {
    this.logger.log(`Creating user with email ${register.email}`);
    return this.prisma.user.create({
      data: {
        name: register.name,
        email: register.email,
        password: register.password,
        phone: register.phone,
        type: register.userType,
      },
    });
  }

  checkPassword(password: string, hash: string): Promise<boolean> {
    this.logger.log(`Checking password for user`);
    return bcrypt.compare(password, hash);
  }

  userExists(email: string): Promise<boolean> {
    this.logger.log(`Checking if user exists with email ${email}`);
    return this.prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((user) => !!user);
  }
}
