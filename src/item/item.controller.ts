import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ItemDto } from 'src/item/dto/item.dto';
import { ItemService } from './item.service';
import { PaginatedItemDto } from 'src/item/dto/paginated-item.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ItemInputDto } from 'src/item/dto/item-input.dto';
import { ItemUpdateDto } from 'src/item/dto/item-update.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOperation({
    summary: 'Criar item',
    description: 'Cria um novo item.',
    tags: ['Item'],
  })
  @ApiResponse({
    status: 201,
    description: 'Item criado com sucesso.',
    type: ItemDto,
  })
  @Post()
  async createItem(@Body() item: ItemInputDto): Promise<ItemDto> {
    return this.itemService.createItem(item);
  }

  @ApiOperation({
    summary: 'Buscar item por id',
    description: 'Busca um item pelo seu Id',
    tags: ['Item'],
  })
  @ApiResponse({
    status: 201,
    description: 'Item encontrado com sucesso.',
    type: ItemDto,
  })
  @Get(':id')
  async getItem(@Query('id') id: number): Promise<ItemDto | null> {
    return this.itemService.getItem(id);
  }

  @ApiOperation({
    summary: 'Buscar itens',
    description: 'Busca todos os itens paginados.',
    tags: ['Item'],
  })
  @ApiResponse({
    status: 201,
    description: 'Itens encontrados com sucesso.',
    type: PaginatedItemDto,
  })
  @Get()
  async getItems(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedItemDto> {
    return this.itemService.getItems(pagination);
  }

  @ApiOperation({
    summary: 'Atualizar item',
    description: 'Atualiza um item pelo seu Id',
    tags: ['Item'],
  })
  @ApiResponse({
    status: 201,
    description: 'Item atualizado com sucesso.',
    type: ItemDto,
  })
  @Patch(':id')
  async updateItem(@Body() item: ItemUpdateDto): Promise<ItemDto> {
    return this.itemService.updateItem(item);
  }

  @ApiOperation({
    summary: 'Remover item',
    description: 'Remove um item pelo seu Id',
    tags: ['Item'],
  })
  @ApiResponse({
    status: 201,
    description: 'Item removido com sucesso.',
    type: ItemDto,
  })
  @Delete(':id')
  async deleteItem(@Query('id') id: number): Promise<ItemDto> {
    return this.itemService.removeItem(id);
  }
}
