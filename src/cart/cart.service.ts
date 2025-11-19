import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { OrderItemService } from 'src/order-item/order-item.service';
import { $Enums, Item, PaymentMethod } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly prisma: PrismaService,
  ) {}

  async getCart(userId: number) {
    // Get open carts
    const items = await this.getOpenCartByUserId(userId);

    // If no open items, return null
    if (!items || items.length === 0) {
      return null;
    }

    // Generate a list of prices per item i.e., price*quantity
    const cartTotal = await Promise.all(
      items.map(async (cart) => {
        const item = await this.prisma.item.findUnique({
          where: { id: cart.itemId },
        });
        if (!item) return 0;
        if (item.unitPrice === null) return 0;
        return item.unitPrice * cart.quantity;
      }),
    );
    // Sum the cart total
    const total = cartTotal.reduce((a, b) => a + b, 0);

    return {
      items,
      total,
    };
  }

  async createNewCart(userId: number, firstItemId: number) {
    // Check if item exists
    if (!(await this.itemExists(firstItemId))) {
      throw new Error('Item does not exist');
    }

    // Check if user has an open cart
    const orderItems = await this.getOpenCartByUserId(userId);
    if (orderItems.length > 0) {
      throw new Error('Cart already exists');
    }

    // Create new order
    const order = await this.prisma.order.create({
      data: {
        userClientId: Number(userId),
        userCreatedById: Number(userId),
        paymentMethod: $Enums.PaymentMethod.CASH,
        status: $Enums.OrderStatus.OPEN,
      },
    });

    // Add first item to order
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
    // Check if item exists
    const itemExists = await this.prisma.item.findUnique({
      where: { id: itemId },
    });
    if (!itemExists) {
      throw new Error('Item does not exist');
    }

    // Get open cart items
    const orderItems = await this.getOpenCartByUserId(userId);

    // If no open cart, create one
    if (!orderItems || orderItems.length === 0) {
      console.log('Creating new cart');
      return this.createNewCart(userId, itemId);
    }

    // Check if item already exists in cart
    const existingItem = orderItems.find((orderItem) => {
      return orderItem.itemId === itemId;
    });

    // If item exists, increase quantity
    if (existingItem) {
      return await this.changeItemQuantity(
        userId,
        itemId,
        existingItem.quantity + 1,
      );
    } else {
      // If item does not exist, add to cart
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

  async itemExists(itemId: number): Promise<boolean> {
    // Check if item exists
    const item = await this.prisma.item.findFirst({
      where: {
        id: itemId,
      },
    });
    return item !== null;
  }

  async getCartItems(userId: number): Promise<Item[] | null> {
    // Get open cart items
    const orderItems = await this.getOpenCartByUserId(userId);

    // If no open cart, return null
    if (!orderItems || orderItems.length === 0) {
      return null;
    }

    // Get item ids from order items
    const itemIds = orderItems.map((orderItem) => orderItem.itemId);

    // Return list of items from item ids
    return await this.prisma.item.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
    });
  }

  async changeItemQuantity(userId: number, itemId: number, quantity: number) {
    // Check if item exists
    if (!(await this.itemExists(itemId))) {
      throw new Error('Item does not exist');
    }
    // Get open cart items
    const orderItems = await this.getOpenCartByUserId(userId);

    // If no open cart, create one
    if (!orderItems || orderItems.length === 0) {
      return this.createNewCart(userId, itemId);
    }

    // Update quantity or remove item
    if (orderItems) {
      await Promise.all(
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
        }),
      );
    }
  }

  async getOpenCartByUserId(userId: number) {
    // Get open cart items
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

  async getProcessingCartByUserId(userId: number) {
    // Get open cart items
    return await this.prisma.orderItem.findMany({
      where: {
        order: {
          userClientId: userId,
          status: $Enums.OrderStatus.PROCESSING,
        },
      },
      include: {
        item: true,
        order: true,
      },
    });
  }

  async proceedToCheckout(userId: number) {
    const orderItems = await this.getOpenCartByUserId(userId);
    if (!orderItems || orderItems.length === 0) {
      throw new Error('No open cart found');
    }
  }

  private async updateOrderStatus(
    orderId: number,
    fromStatus: $Enums.OrderStatus,
    toStatus: $Enums.OrderStatus,
  ) {
    const result = await this.prisma.order.updateMany({
      where: {
        id: orderId,
        status: fromStatus,
      },
      data: {
        status: toStatus,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        `Order with ID #${orderId} and status ${fromStatus} not found`,
      );
    }
    return result;
  }

  async toPaymentCart(orderId: number) {
    return this.updateOrderStatus(
      orderId,
      $Enums.OrderStatus.OPEN,
      $Enums.OrderStatus.PROCESSING,
    );
  }

  async processingToCompletedCart(orderId: number) {
    return this.updateOrderStatus(
      orderId,
      $Enums.OrderStatus.PROCESSING,
      $Enums.OrderStatus.COMPLETED,
    );
  }

  async cancelCart(orderId: number) {
    const result = await this.prisma.order.updateMany({
      where: {
        id: orderId,
        status: {
          in: [$Enums.OrderStatus.OPEN, $Enums.OrderStatus.PROCESSING],
        },
      },
      data: {
        status: $Enums.OrderStatus.CANCELLED,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        `Order with ID #${orderId} with status OPEN or PROCESSING not found for cancellation.`,
      );
    }

    return result;
  }

  async changePaymentMethod(
    userId: number,
    orderId: number,
    paymentMethod: PaymentMethod,
  ) {
    return await this.prisma.order.update({
      where: {
        id: orderId,
        userClientId: userId,
      },
      data: {
        paymentMethod: paymentMethod,
      },
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
