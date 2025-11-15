import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';
import { PaginationMetaDto } from '../../pagination/pagination-meta.dto';

export class PaginatedItemDto {
  @ApiProperty({
    description: 'Array de itens na página atual',
    type: [ItemDto],
  })
  data: ItemDto[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(data: ItemDto[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
