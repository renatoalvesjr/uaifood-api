import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';
import { PaginationMetaDto } from 'src/pagination/pagination-meta.dto';

export class PaginatedOrderItemDto {
  @ApiProperty({
    description: 'Array de itens na página atual',
    type: [OrderItemDto],
  })
  data: OrderItemDto[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(data: OrderItemDto[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
