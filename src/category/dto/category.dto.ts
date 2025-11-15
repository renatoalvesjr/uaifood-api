import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    description: 'Id da categoria',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Lanches',
  })
  description: string;

  @ApiProperty({
    description: 'Data de criação da categoria',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização da categoria',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
