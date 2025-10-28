import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../common/pagination-meta.dto';
import { OrderDto } from './order.dto';

export class PaginatedOrderDto {
  @ApiProperty({
    description: 'Array de pedidos na página atual',
    type: [OrderDto],
  })
  data: OrderDto[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(data: OrderDto[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
