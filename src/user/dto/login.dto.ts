import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode ser vazio' })
  email: string;
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha123!',
  })
  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Senha inválida',
    },
  )
  password: string;
}
