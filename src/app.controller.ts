import { Controller, Get } from '@nestjs/common';
import { $Enums } from 'generated/prisma';

@Controller()
export class AppController {
  constructor() {}

  @Get('payment-methods')
  getPaymentMethods() {
    return [
      $Enums.PaymentMethod.CASH,
      $Enums.PaymentMethod.PIX,
      $Enums.PaymentMethod.CREDIT,
      $Enums.PaymentMethod.DEBIT,
    ];
  }
  @Get('order-statuses')
  getOrderStatuses() {
    return [
      $Enums.OrderStatus.OPEN,
      $Enums.OrderStatus.PROCESSING,
      $Enums.OrderStatus.COMPLETED,
      $Enums.OrderStatus.CANCELLED,
    ];
  }

  @Get('user-types')
  userTypes() {
    return [$Enums.UserType.ADMIN, $Enums.UserType.CLIENT];
  }
}
