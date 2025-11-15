import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OrderItemInputDto {
  @ApiProperty({
    description: 'Id da ordem',
    example: 1,
  })
  @IsNumber({}, { message: 'Id da ordem deve ser um número' })
  @IsNotEmpty({ message: 'Id da ordem não pode ser vazio' })
  orderId: number;

  @ApiProperty({
    description: 'Id do item',
    example: 1,
  })
  @IsNumber({}, { message: 'Id do item deve ser um número' })
  @IsNotEmpty({ message: 'Id do item não pode ser vazio' })
  itemId: number;

  @ApiProperty({
    description: 'Quantidade do item',
    example: 1,
  })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @IsNotEmpty({ message: 'Quantidade não pode ser vazio' })
  @Min(1, { message: 'Quantidade deve ser maior que zero' })
  quantity: number;
}
