import { Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemInputDto } from 'src/models/order-item/order-item-input.dto';
import { PaginationDto } from 'src/models/common/pagination.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderItemDto } from 'src/models/order-item/order-item.dto';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @ApiOperation({
    summary: 'Create a new order item',
    description: 'Create a new order item',
    tags: ['OrderItem'],
  })
  @ApiResponse({
    status: 201,
    description: 'The order item has been successfully created.',
    type: OrderItemDto,
  })
  @Post()
  createOrderItem(orderItem: OrderItemInputDto) {
    return this.orderItemService.createOrderItem(orderItem);
  }

  @ApiOperation({
    summary: 'Get order items',
    description: 'Get order items',
    tags: ['OrderItem'],
  })
  @ApiResponse({
    status: 200,
    description: 'The order items have been successfully retrieved.',
    type: OrderItemDto,
  })
  @Get()
  getOrderItems(pagination: PaginationDto) {
    return this.orderItemService.getOrderItems(pagination);
  }

  @ApiOperation({
    summary: 'Get order item',
    description: 'Get order item',
    tags: ['OrderItem'],
  })
  @ApiResponse({
    status: 200,
    description: 'The order item has been successfully retrieved.',
    type: OrderItemDto,
  })
  @Get(':orderId/:itemId')
  getOrderItem(orderId: number, itemId: number) {
    return this.orderItemService.getOrderItem(orderId, itemId);
  }

  @ApiOperation({
    summary: 'Update order item',
    description: 'Update order item',
    tags: ['OrderItem'],
  })
  @ApiResponse({
    status: 200,
    description: 'The order item has been successfully updated.',
    type: OrderItemDto,
  })
  @Patch(':orderId/:itemId')
  updateOrderItem(
    orderId: number,
    itemId: number,
    @Query('quantity') quantity: number,
  ) {
    return this.orderItemService.updateOrderItem(orderId, itemId, quantity);
  }

  @ApiOperation({
    summary: 'Remove order item',
    description: 'Remove order item',
    tags: ['OrderItem'],
  })
  @ApiResponse({
    status: 200,
    description: 'The order item has been successfully removed.',
    type: OrderItemDto,
  })
  @Delete(':orderId/:itemId')
  removeOrderItem(orderId: number, itemId: number) {
    return this.orderItemService.removeOrderItem(orderId, itemId);
  }
}
