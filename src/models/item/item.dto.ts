import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from '../category/category.dto';

export class ItemDto {
  @ApiProperty({
    description: 'Id do item',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Descrição do item',
    example: 'Hamburguer',
  })
  description: string;

  @ApiProperty({
    description: 'Preço unitário do item',
    example: 10.0,
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Categoria do item',
    type: () => CategoryDto,
  })
  category: CategoryDto;

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
