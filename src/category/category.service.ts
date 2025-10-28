import { Injectable, Logger } from '@nestjs/common';
import { CategoryInputDto } from 'src/models/category/category-input.dto';
import { CategoryUpdateDto } from 'src/models/category/category-update.dto';
import { CategoryDto } from 'src/models/category/category.dto';
import { PaginatedCategoryDto } from 'src/models/category/paginated-category.dto';
import { PaginationMetaDto } from 'src/models/common/pagination-meta.dto';
import { PaginationDto } from 'src/models/common/pagination.dto';
import { PrismaService } from 'src/prisma/psirma.service';

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
  async getCategories(
    paginationDto: PaginationDto,
  ): Promise<PaginatedCategoryDto> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    this.logger.log(`Getting categories - Page: ${page}, Limit: ${limit}`);
    const totalItems = await this.prisma.category.count();
    const data = await this.prisma.category.findMany({
      skip,
      take: Number(limit),
      orderBy: { id: 'asc' },
    });

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = data.length;

    const meta: PaginationMetaDto = {
      totalItem: totalItems,
      itemCount,
      page,
      limit,
      totalPages,
    };

    return new PaginatedCategoryDto(data, meta);
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
