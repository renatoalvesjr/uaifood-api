import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderInputDto } from './dto/order-input.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrderDto } from './dto/order.dto';
import { PaginatedOrderDto } from './dto/paginated-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Criar pedido',
    description: 'Cria um novo pedido.',
    tags: ['Pedido'],
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso.',
    type: OrderDto,
  })
  @Post()
  createOrder(@Body() order: OrderInputDto): Promise<OrderDto> {
    return this.orderService.createOrder(order);
  }

  @ApiOperation({
    summary: 'Buscar pedidos',
    description: 'Busca todos os pedidos paginados.',
    tags: ['Pedido'],
  })
  @ApiResponse({
    status: 201,
    description: 'Pedidos encontrados com sucesso.',
    type: PaginatedOrderDto,
  })
  @Get()
  getOrders(@Query() pagination: PaginationDto): Promise<PaginatedOrderDto> {
    return this.orderService.getOrders(pagination);
  }

  @ApiOperation({
    summary: 'Buscar pedido por id',
    description: 'Busca um pedido pelo seu Id',
    tags: ['Pedido'],
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido encontrado com sucesso.',
    type: OrderDto,
  })
  @Get(':id')
  getOrder(@Query('id') id: number): Promise<OrderDto | null> {
    return this.orderService.getOrder(id);
  }

  @ApiOperation({
    summary: 'Atualizar pedido',
    description: 'Atualiza um pedido pelo seu Id',
    tags: ['Pedido'],
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido atualizado com sucesso.',
    type: OrderDto,
  })
  @Patch(':id')
  updateOrder(@Body() order: OrderUpdateDto): Promise<OrderDto> {
    return this.orderService.updateOrder(order);
  }

  @ApiOperation({
    summary: 'Remover pedido',
    description: 'Remove um pedido pelo seu Id',
    tags: ['Pedido'],
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido removido com sucesso.',
    type: OrderDto,
  })
  @Delete(':id')
  removeOrder(@Query('id') id: number): Promise<OrderDto> {
    return this.orderService.removeOrder(id);
  }
}
