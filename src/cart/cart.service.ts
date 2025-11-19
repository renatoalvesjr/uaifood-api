import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { OrderItemService } from 'src/order-item/order-item.service';
import { $Enums, Item, OrderItem, PaymentMethod } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly prisma: PrismaService,
  ) {}

  async createNewCart(userId: number, firstItemId: number) {
    const orderItems = await this.getOpenCartByUserId(userId);
    if (orderItems) {
      throw new Error('Cart already exists');
    }
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
      include: {
        item: true,
        order: true,
      },
    });
    return orderItem;
  }

  async addCartItem(userId: number, itemId: number) {
    console.log(`Adding item to cart ${itemId} for user ${userId}`);
    const orderItems = await this.getOpenCartByUserId(userId);
    if (!orderItems || orderItems.length === 0) {
      console.log('Creating new cart');
      return this.createNewCart(userId, itemId);
    }

    const existingItem = orderItems.find((orderItem) => {
      return orderItem.itemId === itemId;
    });
    console.log(existingItem);

    if (existingItem) {
      return await this.changeItemQuantity(
        userId,
        itemId,
        existingItem.quantity + 1,
      );
    } else {
      const orderItem = await this.prisma.orderItem.create({
        data: {
          orderId: orderItems[0].orderId,
          quantity: 1,
          itemId: itemId,
        },
        include: {
          item: true,
          order: true,
        },
      });
      return orderItem;
    }
  }

  async getCartItems(userId: number): Promise<Item[]> {
    const orderItems = await this.getOpenCartByUserId(userId);

    if (!orderItems || orderItems.length === 0) {
      return [];
    }

    const itemPromises = orderItems.map((orderItem) =>
      this.prisma.item.findUnique({
        where: {
          id: orderItem.itemId,
        },
      }),
    );

    const items = await Promise.all(itemPromises);

    // Filter out any null results (if an item wasn't found for some reason)
    const validItems = items.filter((item): item is Item => item !== null);

    console.log(validItems);
    return validItems;
  }

  async changeItemQuantity(userId: number, itemId: number, quantity: number) {
    const orderItems = await this.getOpenCartByUserId(userId);

    if (orderItems) {
      orderItems.map(async (orderItem) => {
        if (orderItem.itemId === itemId) {
          if (quantity <= 0) {
            await this.prisma.orderItem.delete({
              where: {
                id: orderItem.id,
              },
            });
          } else {
            await this.prisma.orderItem.update({
              where: {
                id: orderItem.id,
              },
              data: {
                quantity: quantity,
              },
            });
          }
        }
      });
    }
  }

  async getOpenCartByUserId(userId: number) {
    return await this.prisma.orderItem.findMany({
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
