import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { OrderModule } from 'src/order/order.module';
import { OrderItemModule } from 'src/order-item/order-item.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [OrderModule, OrderItemModule, PrismaModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
