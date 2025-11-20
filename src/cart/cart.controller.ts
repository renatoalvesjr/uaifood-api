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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { $Enums } from 'generated/prisma';
import { SanitizedUser } from 'src/auth/auth.service';

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
  getOpenCartByUserId(@Request() req: { user: SanitizedUser }) {
    return this.cartService.getCart(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('finalized-orders')
  async getFinalizedOrders(@Request() req: { user: SanitizedUser }) {
    return await this.cartService.getAllCarts(req.user.id);
  }


  @ApiOperation({
    summary: 'Get cart items',
    description: 'Get cart items',
    tags: ['Cart'],
  })
  @UseGuards(JwtAuthGuard)
  @Get('items')
  async getCartItems(@Request() req: { user: SanitizedUser }) {
    return await this.cartService.getCartItems(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-quantity')
  addItemToCart(
    @Request() req: { user: SanitizedUser },
    @Body() changeQuantity: { itemId: number; quantity: number },
  ) {
    return this.cartService.changeItemQuantity(
      req.user.id,
      changeQuantity.itemId,
      changeQuantity.quantity,
    );
  }

  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Add item to cart',
    tags: ['Cart'],
  })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart',
  })
  @UseGuards(JwtAuthGuard)
  @Post('add-item/:itemId')
  async addCartItem(
    @Request() req: { user: SanitizedUser },
    @Param('itemId') itemId: number,
  ) {
    try {
      return await this.cartService.addCartItem(req.user.id, itemId);
    } catch (error: any) {
      if (error instanceof Error) {
        console.error(error.message);
        return error.message;
      }
      return 'An unexpected error occurred';
    }
  }

  @ApiOperation({
    summary: 'Proceed to checkout',
    description: 'Proceed to checkout',
    tags: ['Cart'],
  })
  @ApiResponse({
    status: 201,
    description: 'Proceed to checkout',
  })
  @UseGuards(JwtAuthGuard)
  @Post('to-payment/:orderId')
  async toPaymentCart(
    @Request() req: { user: SanitizedUser },
    @Param('orderId') orderId: number,
  ) {
    return this.cartService.openToProcessingCart(req.user.id, orderId);
  }

  @ApiOperation({
    summary: 'Complete order',
    description: 'Complete order',
    tags: ['Cart'],
  })
  @ApiResponse({
    status: 201,
    description: 'Complete order',
  })
  @UseGuards(JwtAuthGuard)
  @Post('complete-order/:orderId')
  async changePaymentMethod(
    @Param('orderId') orderId: number,
    @Request() req: { user: SanitizedUser },
  ) {
    return this.cartService.processingToCompletedCart(req.user.id, orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel-order/:orderId')
  async cancelOrder(
    @Request() req: { user: SanitizedUser },
    @Param('orderId') orderId: number,
  ) {
    return this.cartService.cancelCart(req.user.id, orderId);
  }
}
