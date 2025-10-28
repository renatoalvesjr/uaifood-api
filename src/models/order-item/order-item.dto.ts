import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({
    description: 'Id da ordem',
    example: 1,
  })
  orderId: number;

  @ApiProperty({
    description: 'Id do item',
    example: 1,
  })
  itemId: number;

  @ApiProperty({
    description: 'Quantidade do item',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Data de criação do item',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do item',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
