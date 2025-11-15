import { ApiProperty } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import { PaginationMetaDto } from 'src/pagination/pagination-meta.dto';

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
