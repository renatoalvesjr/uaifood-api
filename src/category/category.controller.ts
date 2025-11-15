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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CategoryDto } from './dto/category.dto';
import { CategoryInputDto } from './dto/category-input.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { PaginatedCategoryDto } from './dto/paginated-category.dto';

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
    return this.categoryService.getCategories(paginationDto);
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
