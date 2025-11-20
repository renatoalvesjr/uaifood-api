import { Injectable, Logger } from '@nestjs/common';
import { PaginationMetaDto } from 'src/pagination/pagination-meta.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryInputDto } from './dto/category-input.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryDto } from './dto/category.dto';
import { PaginatedCategoryDto } from './dto/paginated-category.dto';

@Injectable()
export class CategoryService {
  logger: Logger = new Logger(CategoryService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(category: CategoryInputDto): Promise<CategoryDto> {
    this.logger.log(
      `Creating category with description ${category.description}`,
    );
    return await this.prisma.category.create({
      data: {
        description: category.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getCategories(): Promise<CategoryDto[]> {
    return await this.prisma.category.findMany();
  }

  async getCategory(id: number): Promise<CategoryDto | null> {
    this.logger.log(`Getting category with id ${id}`);
    return await this.prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });
  }
  async removeCategory(id: number): Promise<CategoryDto> {
    this.logger.log(`Removing category with id ${id}`);

    return await this.prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
  }
  async updateCategory(
    categoryUpdate: CategoryUpdateDto,
  ): Promise<CategoryDto> {
    this.logger.log(`Updating category with id ${categoryUpdate.id}`);
    const reponse = await this.prisma.category.update({
      where: {
        id: Number(categoryUpdate.id),
      },
      data: {
        description: categoryUpdate.description,
        updatedAt: new Date(),
      },
    });
    if (!reponse) {
      throw new Error(`Category with id ${categoryUpdate.id} not found`);
    }
    this.logger.log(`Category with id ${categoryUpdate.id} updated`);
    return reponse;
  }
}
