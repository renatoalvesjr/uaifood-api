import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryUpdateDto } from 'src/models/category/category-update.dto';
import { CategoryInputDto } from 'src/models/category/category-input.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryDto } from 'src/models/category/category.dto';
import { PaginationDto } from 'src/models/common/pagination.dto';
import { PaginatedCategoryDto } from 'src/models/category/paginated-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Criar categoria',
    description: 'Cria uma nova categoria.',
    tags: ['Category'],
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso.',
    type: CategoryDto,
  })
  @Post()
  async createCategory(@Body() category: CategoryInputDto) {
    return this.categoryService.createCategory(category);
  }

  @ApiOperation({
    summary: 'Buscar categorias',
    description: 'Busca todas as categorias paginados.',
    tags: ['Category'],
  })
  @ApiResponse({
    status: 201,
    description: 'Categorias encontradas com sucesso.',
    type: PaginatedCategoryDto,
  })
  @Get()
  async getCategories(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedCategoryDto> {
    return this.categoryService.getCategoriesPaginated(paginationDto);
  }

  @ApiOperation({
    summary: 'Buscar categoria por id',
    description: 'Busca uma categoria pelo seu Id',
    tags: ['Category'],
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria encontrada com sucesso.',
    type: CategoryDto,
  })
  @Get(':id')
  async getCategory(@Query('id') id: number): Promise<CategoryDto | null> {
    return this.categoryService.getCategory(id);
  }

  @ApiOperation({
    summary: 'Atualizar categoria',
    description: 'Atualiza uma categoria pelo seu Id',
    tags: ['Category'],
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria atualizada com sucesso.',
    type: CategoryDto,
  })
  @Patch(':id')
  async updateCategory(
    @Body() categoryUpdated: CategoryUpdateDto,
  ): Promise<CategoryDto> {
    return this.categoryService.updateCategory(categoryUpdated);
  }

  @ApiOperation({
    summary: 'Remover categoria',
    description: 'Remove uma categoria pelo seu Id',
    tags: ['Category'],
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria removida com sucesso.',
    type: CategoryDto,
  })
  @Delete(':id')
  async deleteCategory(@Query('id') id: number): Promise<CategoryDto> {
    return this.categoryService.removeCategory(id);
  }
}
