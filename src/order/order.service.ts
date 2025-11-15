import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { OrderInputDto } from './dto/order-input.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrderDto } from './dto/order.dto';
import { PaginatedOrderDto } from './dto/paginated-order.dto';

@Injectable()
export class OrderService {
  logger: Logger = new Logger(OrderService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(order: OrderInputDto): Promise<OrderDto> {
    this.logger.log(
      `Creating order with userClientId ${order.userClientId}, userCreatedById ${order.userCreatedById} and status ${order.status}`,
    );
    return await this.prisma.order.create({
      data: {
        userClientId: Number(order.userClientId),
        paymentMethod: order.paymentMethod,
        userCreatedById: Number(order.userCreatedById),
        status: order.status,
      },
    });
  }

  async getOrders(pagination: PaginationDto): Promise<PaginatedOrderDto> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    this.logger.log(`Getting orders - Page: ${page}, Limit: ${limit}`);
    const totalItems = await this.prisma.order.count();
    const data = await this.prisma.order.findMany({
      skip,
      take: Number(limit),
      orderBy: { id: 'asc' },
    });
    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = data.length;

    return new PaginatedOrderDto(data, {
      totalItem: totalItems,
      itemCount,
      page,
      limit,
      totalPages,
    });
  }

  async getOrder(id: number): Promise<OrderDto | null> {
    this.logger.log(`Getting order with id ${id}`);
    return await this.prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async updateOrder(orderUpdate: OrderUpdateDto): Promise<OrderDto> {
    this.logger.log(`Updating order with id ${orderUpdate.id}`);
    const response = await this.prisma.order.update({
      where: {
        id: Number(orderUpdate.id),
      },
      data: {
        paymentMethod: orderUpdate.paymentMethod,
        status: orderUpdate.status,
      },
    });
    if (!response) {
      throw new Error(`Order with id ${orderUpdate.id} not found`);
    }
    return response;
  }

  async removeOrder(id: number): Promise<OrderDto> {
    this.logger.log(`Removing order with id ${id}`);
    return await this.prisma.order.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
