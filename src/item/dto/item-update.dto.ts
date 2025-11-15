import { ApiProperty } from '@nestjs/swagger';

export class ItemUpdateDto {
  @ApiProperty({
    description: 'Id do item',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Descrição do item',
    example: 'Hamburguer',
  })
  description?: string;

  @ApiProperty({
    description: 'Preço unitário do item',
    example: 10.0,
  })
  unitPrice?: number;

  @ApiProperty({
    description: 'Id da categoria do item',
    example: 1,
  })
  categoryId?: number;
}
