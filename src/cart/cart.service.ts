import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { OrderItemService } from 'src/order-item/order-item.service';
import { OrderInputDto } from 'src/order/dto/order-input.dto';
import { OrderItemInputDto } from 'src/order-item/dto/order-item-input.dto';
import { PaymentMethod } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly prisma: PrismaService,
  ) {}

  async createNewCart(newOrder: OrderInputDto) {
    return await this.orderService.createOrder(newOrder);
  }

  async addItemToCart(orderItem: OrderItemInputDto) {
    return await this.orderItemService.createOrderItem(orderItem);
  }

  async getOpenCartByUserId(userId: number) {
    return await this.prisma.order.findFirst({
      where: {
        userClientId: Number(userId),
        status: 'OPEN',
      },
    });
  }

  async removeItemFromCart(orderId: number, itemId: number) {
    const orderItem = await this.orderItemService.getOrderItem(orderId, itemId);
    if (orderItem) {
      return await this.orderItemService.removeOrderItem(
        orderItem.orderId,
        itemId,
      );
    }
    return null;
  }

  async cancelCart(orderItemId: number) {
    return await this.orderService.updateOrderStatus({
      id: orderItemId,
      status: 'CANCELLED',
    });
  }

  async getCartItems(orderId: number) {
    return await this.orderItemService.getItemsByOrderId(orderId);
  }

  async changePaymentMethod(orderId: number, paymentMethod: PaymentMethod) {
    return await this.orderService.updateOrderPaymentMethod({
      id: orderId,
      paymentMethod: paymentMethod,
    });
  }

  async updateItemQuantity(orderId: number, itemId: number, quantity: number) {
    const orderItem = await this.orderItemService.getOrderItem(orderId, itemId);
    if (orderItem) {
      return await this.orderItemService.updateOrderItem(
        orderItem.orderId,
        itemId,
        quantity,
      );
    }
  }

  async getCartItemsCount(orderId: number) {
    const items = await this.orderItemService.getItemsByOrderId(orderId);
    return items.length;
  }
}
