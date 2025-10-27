import { ApiProperty } from '@nestjs/swagger';

export class CategoryInputDto {
  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Lanches',
  })
  description: string;
}
