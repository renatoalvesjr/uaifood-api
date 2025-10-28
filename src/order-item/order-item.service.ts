import { Injectable, Logger } from '@nestjs/common';
import { PaginationDto } from 'src/models/common/pagination.dto';
import { OrderItemInputDto } from 'src/models/order-item/order-item-input.dto';
import { OrderItemDto } from 'src/models/order-item/order-item.dto';
import { PaginatedOrderItemDto } from 'src/models/order-item/paginated-order-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderItemService {
  logger: Logger = new Logger(OrderItemService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createOrderItem(orderItem: OrderItemInputDto): Promise<OrderItemDto> {
    return await this.prisma.orderItem.create({
      data: {
        orderId: Number(orderItem.orderId),
        itemId: Number(orderItem.itemId),
        quantity: Number(orderItem.quantity),
      },
    });
  }

  async getOrderItem(
    orderId: number,
    itemId: number,
  ): Promise<OrderItemDto | null> {
    this.logger.log(
      `Getting order item with orderId ${orderId} and itemId ${itemId}`,
    );
    return await this.prisma.orderItem.findFirst({
      where: {
        orderId: Number(orderId),
        itemId: Number(itemId),
      },
    });
  }

  async getOrderItems(
    pagination: PaginationDto,
  ): Promise<PaginatedOrderItemDto> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    this.logger.log(`Getting order items - Page: ${page}, Limit: ${limit}`);
    const totalItems = await this.prisma.orderItem.count();
    const data = await this.prisma.orderItem.findMany({
      skip,
      take: Number(limit),
      orderBy: { id: 'asc' },
    });
    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = data.length;

    return new PaginatedOrderItemDto(data, {
      totalItem: totalItems,
      itemCount,
      page,
      limit,
      totalPages,
    });
  }

  async updateOrderItem(
    orderId: number,
    itemId: number,
    quantity: number,
  ): Promise<OrderItemDto> {
    return await this.prisma.orderItem.update({
      where: {
        orderId_itemId: {
          orderId: Number(orderId),
          itemId: Number(itemId),
        },
      },
      data: {
        quantity: Number(quantity),
      },
    });
  }

  async removeOrderItem(
    orderId: number,
    itemId: number,
  ): Promise<OrderItemDto> {
    this.logger.log(
      `Removing order item with orderId ${orderId} and itemId ${itemId}`,
    );
    return await this.prisma.orderItem.delete({
      where: {
        orderId_itemId: {
          orderId: Number(orderId),
          itemId: Number(itemId),
        },
      },
    });
  }
}
