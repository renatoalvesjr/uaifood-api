/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService, SanitizedUser } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenDto } from 'src/user/dto/token.dto';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Response } from 'express';
import { LoginDto } from 'src/user/dto/login.dto';
import { Roles } from './guards/roles.decorator';
import { UserType } from 'generated/prisma';
import { RolesGuard } from './guards/roles.guard';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login',
    description: 'Login de usuário por email',
    tags: ['Auth'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Caso o login seja bem sucedido, retorna um token',
    type: TokenDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Retorno caso haja falha durante o login',
    type: '',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(
    @Body() _: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Request() req: { user: SanitizedUser },
  ) {
    const token = await this.authService.login(req.user);
    response.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600 * 1000,
    });
    return token;
  }

  @ApiOperation({
    summary: 'Register',
    description: 'Register de usuário',
    tags: ['Auth'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Caso o cadastro seja bem sucedido, retorna um token',
    type: TokenDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: UserRegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @Roles(UserType.CLIENT)
  getProfile(@Request() req: { user: SanitizedUser }) {
    console.log('Logged user:', req.user);
    return req.user;
  }
}
