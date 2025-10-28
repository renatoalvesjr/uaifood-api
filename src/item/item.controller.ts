import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ItemDto } from 'src/models/item/item.dto';
import { ItemService } from './item.service';
import { PaginatedItemDto } from 'src/models/item/paginated-item.dto';
import { PaginationDto } from 'src/models/common/pagination.dto';
import { ItemInputDto } from 'src/models/item/item-input.dto';
import { ItemUpdateDto } from 'src/models/item/item-update.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async createItem(@Body() item: ItemInputDto): Promise<ItemDto> {
    return this.itemService.createItem(item);
  }

  @Get(':id')
  async getItem(@Query('id') id: number): Promise<ItemDto | null> {
    return this.itemService.getItem(id);
  }

  @Get()
  async getItems(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedItemDto> {
    return this.itemService.getItems(pagination);
  }

  @Patch(':id')
  async updateItem(@Body() item: ItemUpdateDto): Promise<ItemDto> {
    return this.itemService.updateItem(item);
  }

  @Delete(':id')
  async deleteItem(@Query('id') id: number): Promise<ItemDto> {
    return this.itemService.removeItem(id);
  }
}
