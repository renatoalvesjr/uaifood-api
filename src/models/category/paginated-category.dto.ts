import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { PaginationMetaDto } from '../common/pagination-meta.dto';

export class PaginatedCategoryDto {
  @ApiProperty({
    description: 'Array de categorias na página atual',
    type: [CategoryDto],
  })
  data: CategoryDto[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(data: CategoryDto[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
