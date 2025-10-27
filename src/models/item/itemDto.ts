import { CategoryDto } from './categoryDto';

export class ItemDto {
  id: number;
  description: string;
  unitPrice: number;
  category: CategoryDto;
  createdAt: Date;
  updatedAt: Date;
}
