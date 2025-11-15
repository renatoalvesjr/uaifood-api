import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from 'generated/prisma';

export class OrderDto {
  @ApiProperty({
    description: 'Id do pedido',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Id do cliente',
    example: 1,
  })
  userClientId: number;

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

  @ApiProperty({
    description: 'Id do usuário que criou o pedido',
    example: 1,
  })
  userCreatedById: number;

  @ApiProperty({
    description: 'Data de criação do pedido',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do pedido',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
