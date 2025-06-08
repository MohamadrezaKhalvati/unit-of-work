// src/orders/orders.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order (demonstrates Unit of Work)' })
  @ApiResponse({ status: 201, description: 'The order has been successfully placed.', type: Order })
  @ApiResponse({ status: 400, description: 'Bad Request (validation errors or insufficient stock)' })
  @ApiResponse({ status: 404, description: 'User or Product not found.' })
  async placeOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.placeOrder(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all orders' })
  @ApiResponse({ status: 200, description: 'List of orders.', type: [Order] })
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an order by ID with details' })
  @ApiResponse({ status: 200, description: 'The found order with its items and user.', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(Number(id));
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an order (demonstrates Unit of Work for rollback)' })
  @ApiResponse({ status: 200, description: 'The order has been successfully cancelled.', type: Order })
  @ApiResponse({ status: 400, description: 'Bad Request (order cannot be cancelled)' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async cancelOrder(@Param('id') id: string): Promise<Order> {
    return this.ordersService.cancelOrder(Number(id));
  }
}