import { Injectable, Logger } from '@nestjs/common';
import { PaginationDto } from 'src/models/common/pagination.dto';
import { ItemInputDto } from 'src/models/item/item-input.dto';
import { ItemUpdateDto } from 'src/models/item/item-update.dto';
import { PaginatedItemDto } from 'src/models/item/paginated-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemService {
  logger: Logger = new Logger(ItemService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createItem(itemInput: ItemInputDto) {
    this.logger.log(`Creating item with description ${itemInput.description}`);
    this.logger.log(itemInput);

    return await this.prisma.item.create({
      data: {
        description: itemInput.description,
        unitPrice: itemInput.unitPrice,
        category: {
          connect: {
            id: itemInput.categoryId,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });
  }

  async getItems(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    this.logger.log(`Getting items - Page: ${page}, Limit: ${limit}`);
    const totalItems = await this.prisma.item.count();
    const data = await this.prisma.item.findMany({
      skip,
      take: Number(limit),
      orderBy: { id: 'asc' },
      include: {
        category: true,
      },
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

  async getItem(id: number) {
    this.logger.log(`Getting item with id ${id}`);
    return await this.prisma.item.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
      },
    });
  }

  async removeItem(id: number) {
    this.logger.log(`Removing item with id ${id}`);
    return await this.prisma.item.delete({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
      },
    });
  }

  async updateItem(itemUpdate: ItemUpdateDto) {
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
      include: {
        category: true,
      },
    });
    if (!reponse) {
      throw new Error(`Item with id ${itemUpdate.id} not found`);
    }
    this.logger.log(`Item with id ${itemUpdate.id} updated`);
    return reponse;
  }
}
