import { PaymentMethod } from 'src/enums/payment-method.enum';
import { UserDto } from '../user/userDto';

export class OrderDto {
  id: number;
  client: UserDto;
  paymentMethod: PaymentMethod;
  status: string;
  createdBy: UserDto;
  createdAt: Date;
  updatedAt: Date;
}
