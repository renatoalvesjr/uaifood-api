/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Get open cart by user id',
    description: 'Get open cart by user id',
    tags: ['Cart'],
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  getOpenCartByUserId(@Request() req: any) {
    return this.cartService.getOpenCartByUserId(req.user.id);
  }

  @ApiOperation({
    summary: 'Create new cart',
    description: 'Create new cart',
    tags: ['Cart'],
  })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createNewCart(@Request() req: any, @Body() itemId: number) {
    return this.cartService.createNewCart(req.user.id, itemId);
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

  @UseGuards(JwtAuthGuard)
  @Post('change-quantity')
  addItemToCart(
    @Request() req: any,
    @Body() changeQuantity: { itemId: number; quantity: number },
  ) {
    return this.cartService.changeItemQuantity(
      req.user.id,
      changeQuantity.itemId,
      changeQuantity.quantity,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-item')
  addCartItem(@Request() req: any, @Body() itemId: number) {
    return this.cartService.addCartItem(req.user.id, itemId);
  }
}
