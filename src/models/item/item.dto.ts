import { CategoryDto } from '../category/category.dto';

export class ItemDto {
  id: number;
  description: string;
  unitPrice: number;
  category: CategoryDto;
  createdAt: Date;
  updatedAt: Date;
}
