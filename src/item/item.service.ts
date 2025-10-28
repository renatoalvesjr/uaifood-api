import { Injectable, Logger } from '@nestjs/common';
import { PaginationDto } from 'src/models/common/pagination.dto';
import { ItemInputDto } from 'src/models/item/item-input.dto';
import { ItemUpdateDto } from 'src/models/item/item-update.dto';
import { ItemDto } from 'src/models/item/item.dto';
import { PaginatedItemDto } from 'src/models/item/paginated-item.dto';
import { PrismaService } from 'src/prisma/psirma.service';

@Injectable()
export class ItemService {
  logger: Logger = new Logger(ItemService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createItem(itemInput: ItemInputDto): Promise<ItemDto> {
    this.logger.log(`Creating item with description ${itemInput.description}`);

    return await this.prisma.item.create({
      data: {
        description: itemInput.description,
        unitPrice: itemInput.unitPrice,
        category: {
          connect: {
            id: itemInput.category,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getItems(paginationDto: PaginationDto): Promise<PaginatedItemDto> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    this.logger.log(`Getting items - Page: ${page}, Limit: ${limit}`);
    const totalItems = await this.prisma.item.count();
    const data = await this.prisma.item.findMany({
      skip,
      take: Number(limit),
      orderBy: { id: 'asc' },
    });

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = data.length;

    return new PaginatedItemDto(data, {
      totalItem: totalItems,
      itemCount,
      page,
      limit,
      totalPages,
    });
  }

  async getItem(id: number): Promise<ItemDto | null> {
    this.logger.log(`Getting item with id ${id}`);
    return await this.prisma.item.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async removeItem(id: number): Promise<ItemDto> {
    this.logger.log(`Removing item with id ${id}`);
    return await this.prisma.item.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async updateItem(itemUpdate: ItemUpdateDto): Promise<ItemDto> {
    this.logger.log(`Updating item with id ${itemUpdate.id}`);
    const reponse = await this.prisma.item.update({
      where: {
        id: Number(itemUpdate.id),
      },
      data: {
        description: itemUpdate.description,
        unitPrice: itemUpdate.unitPrice,
        category: {
          connect: {
            id: itemUpdate.categoryId,
          },
        },
        updatedAt: new Date(),
      },
    });
    if (!reponse) {
      throw new Error(`Item with id ${itemUpdate.id} not found`);
    }
    this.logger.log(`Item with id ${itemUpdate.id} updated`);
    return reponse;
  }
}
