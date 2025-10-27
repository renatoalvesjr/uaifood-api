import { ApiProperty } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ApiProperty({
    description: 'Id da categoria',
    example: 1,
  })
  id: bigint;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Lanches',
  })
  description: string;
}
