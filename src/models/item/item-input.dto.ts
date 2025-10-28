import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ItemInputDto {
  @ApiProperty({
    description: 'Descrição do item',
    example: 'Hamburguer',
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição não pode ser vazia' })
  description: string;

  @ApiProperty({
    description: 'Preço unitário do item',
    example: 10.0,
  })
  @IsNumber({}, { message: 'Preço unitário deve ser um número' })
  @IsNotEmpty({ message: 'Preço unitário não pode ser vazio' })
  @Min(0.01, { message: 'Preço unitário deve ser maior que zero' })
  unitPrice: number;

  @ApiProperty({
    description: 'Id da categoria do item',
    example: 1,
  })
  category: number;
}
