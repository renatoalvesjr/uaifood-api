import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from 'generated/prisma';

export class OrderInputDto {
  @ApiProperty({
    description: 'Id do cliente',
    example: 1,
  })
  userClientId: number;

  @ApiProperty({
    description: 'Id do usuário que criou o pedido',
    example: 1,
  })
  userCreatedById: number;

  @ApiProperty({
    description: 'Método de pagamento',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Status do pedido',
    example: 'PENDENTE',
  })
  status: string;
}
