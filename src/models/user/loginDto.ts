import { ApiProperty } from '@nestjs/swagger';

export class LoginDtop {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  email: string;
  @ApiProperty({
    description: 'Senha do usuário',
    example: '123456',
  })
  password: string;
}
