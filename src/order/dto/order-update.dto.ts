import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from 'generated/prisma';

export class OrderUpdateDto {
  @ApiProperty({
    description: 'Id do pedido',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'Id do pedido',
    example: 1,
  })
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Status do pedido',
    example: 'PENDENTE',
  })
  status?: string;
}
