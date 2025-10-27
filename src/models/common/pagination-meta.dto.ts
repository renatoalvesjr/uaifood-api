import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total de itens',
    example: 100,
  })
  @IsNumber()
  totalItem: number;

  @ApiProperty({
    description: 'Total de itens na página atual',
    example: 10,
  })
  @IsNumber()
  itemCount: number;

  @ApiProperty({
    description: 'Número da página atual',
    example: 1,
  })
  @IsNumber()
  page: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @IsNumber()
  limit: number = 10;

  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  @IsNumber()
  totalPages: number;
}
