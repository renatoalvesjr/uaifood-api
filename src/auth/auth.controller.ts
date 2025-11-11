/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/models/user/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenDto } from 'src/models/user/token.dto';
import { UserRegisterDto } from 'src/models/user/user-register.dto';
import type { Response } from 'express';
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
  @Post('login')
  async signIn(
    @Body() signInDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.signIn(signInDto);
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
}
