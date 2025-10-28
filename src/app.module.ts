import { OrderItemModule } from './order-item/order-item.module';
import { OrderModule } from './order/order.module';
import { ItemModule } from './item/item.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    OrderItemModule,
    OrderModule,
    ItemModule,
    CategoryModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
