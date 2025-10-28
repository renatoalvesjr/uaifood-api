import { OrderItemController } from './order-item.controller';
import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
