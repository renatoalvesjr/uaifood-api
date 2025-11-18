import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Get open cart by user id',
    description: 'Get open cart by user id',
    tags: ['Cart'],
  })
  @Get(':userId')
  getOpenCartByUserId(@Param('userId') userId: number) {
    return this.cartService.getOpenCartByUserId(userId);
  }

  @ApiOperation({
    summary: 'Create new cart',
    description: 'Create new cart',
    tags: ['Cart'],
  })
  @Post('create')
  createNewCart(@Body() newOrder: any) {
    return this.cartService.createNewCart(newOrder);
  }

  @ApiOperation({
    summary: 'Get cart items',
    description: 'Get cart items',
    tags: ['Cart'],
  })
  @Get(':orderId/items')
  getCartItems(@Param('orderId') orderId: number) {
    return this.cartService.getCartItems(orderId);
  }
}
