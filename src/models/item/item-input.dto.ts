import { ApiProperty } from '@nestjs/swagger';

export class ItemInputDto {
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
    description: 'Id da categoria do item',
    example: 1,
  })
  category: number;
}
