import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { OrderItemService } from 'src/order-item/order-item.service';
import { $Enums, PaymentMethod } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly prisma: PrismaService,
  ) {}

  async createNewCart(userId: number, firstItemId: number) {
    const order = await this.prisma.order.create({
      data: {
        userClientId: Number(userId),
        userCreatedById: Number(userId),
        paymentMethod: $Enums.PaymentMethod.CASH,
        status: $Enums.OrderStatus.OPEN,
      },
    });
    const orderItem = await this.prisma.orderItem.create({
      data: {
        orderId: order.id,
        quantity: 1,
        itemId: firstItemId,
      },
    });

    return orderItem;
  }

  async changeItemQuantity(userId: number, itemId: number, quantity: number) {
    const orderItem = await this.getOpenCartByUserId(userId);
    if (orderItem) {
      const updateOrderItem = await this.prisma.orderItem.update({
        where: {
          id: orderItem.id,
          itemId: itemId,
        },
        data: {
          quantity: quantity,
        },
      });
      return updateOrderItem;
    }
    return null;
  }

  async getOpenCartByUserId(userId: number) {
    return await this.prisma.orderItem.findFirst({
      where: {
        order: {
          userClientId: userId,
          status: $Enums.OrderStatus.OPEN,
        },
      },
      include: {
        item: true,
        order: true,
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
