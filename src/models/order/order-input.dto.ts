import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from 'generated/prisma';

export class OrderInputDto {
  @ApiProperty({
    description: 'Id do cliente',
    example: 1,
  })
  @IsNumber({}, { message: 'Id do cliente deve ser um número' })
  @IsNotEmpty({ message: 'Id do cliente não pode ser vazio' })
  userClientId: number;

  @ApiProperty({
    description: 'Id do usuário que criou o pedido',
    example: 1,
  })
  @IsNumber({}, { message: 'Id do cliente deve ser um número' })
  @IsNotEmpty({ message: 'Id do cliente não pode ser vazio' })
  userCreatedById: number;

  @ApiProperty({
    description: 'Método de pagamento',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  @IsEnum(PaymentMethod, { message: 'Método de pagamento inválido' })
  @IsNotEmpty({ message: 'Método de pagamento não pode ser vazio' })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Status do pedido',
    example: 'PENDENTE',
  })
  @IsString({ message: 'Status deve ser uma string' })
  @IsNotEmpty({ message: 'Status não pode ser vazio' })
  status: string;
}
