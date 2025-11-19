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

  @ApiOperation({
    summary: 'Get cart items',
    description: 'Get cart items',
    tags: ['Cart'],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/items')
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

  @UseGuards(JwtAuthGuard)
  @Post('to-payment/:orderId')
  async toPaymentCart(@Param('orderId') orderId: number) {
    return this.cartService.toPaymentCart(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-payment-method')
  async changePaymentMethod(
    @Body()
    changePaymentMethod: {
      orderId: number;
      paymentMethod: $Enums.PaymentMethod;
    },
    @Request() req: { user: SanitizedUser },
  ) {
    return this.cartService.changePaymentMethod(
      req.user.id,
      changePaymentMethod.orderId,
      changePaymentMethod.paymentMethod,
    );
  }
}
