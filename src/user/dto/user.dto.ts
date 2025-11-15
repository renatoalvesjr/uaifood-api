import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'generated/prisma';

export class UserDto {
  @ApiProperty({
    description: 'Id do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Renato',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Endereço do usuário',
    example: {
      id: 1,
      street: 'Rua dos Bobos',
      number: '0',
      district: 'Bairro dos Bobos',
      city: 'Cidade dos Bobos',
      state: 'Estado dos Bobos',
      zipCode: '00000-000',
      createdAt: new Date(),
    },
  })
  addressId: number;

  @ApiProperty({
    description: 'Telefone do usuario',
    example: '34999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'Tipo de usuario',
    enum: UserType,
    example: UserType.CLIENT,
  })
  userType: UserType;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
