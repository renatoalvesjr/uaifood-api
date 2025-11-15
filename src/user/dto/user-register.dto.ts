import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserType } from 'generated/prisma';

export class UserRegisterDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Renato',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha123!',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Senha inválida' },
  )
  password: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '34999999999',
  })
  @IsOptional({ message: 'Telefone pode ser vazio' })
  @IsString({ message: 'Telefone deve ser uma string' })
  phone: string;

  @ApiProperty({
    description: 'Tipo de usuário',
    enum: UserType,
    example: UserType.CLIENT,
    default: UserType.CLIENT,
  })
  @ApiProperty({
    description: 'Tipo de usuario',
    enum: UserType,
    example: UserType.CLIENT,
  })
  userType: UserType;
}
