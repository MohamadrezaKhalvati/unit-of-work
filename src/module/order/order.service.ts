// src/orders/orders.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderItem } from '../product/entities/order-item.entity';

import { Transaction } from 'src/core/decorators';
import { ProductRepository } from '../product/repository/product.repository';
import { UserRepository } from '../user/repository/user.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/order-status.enum';
import { OrderItemRepository } from './repository/order-item.repository';
import { OrderRepository } from './repository/order.repository';



@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  @Transaction()
  async placeOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { user_id, items } = createOrderDto;

    // 1. Verify user exists
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new NotFoundException(`User with ID "${user_id}" not found.`);
    }

    let totalPrice = 0;
    const orderItemsToCreate: OrderItem[] = [];

    // 2. Validate products and update stock
    for (const itemDto of items) {
      const product = await this.productRepository.findById(itemDto.product_id);
      if (!product) {
        throw new NotFoundException(`Product with ID "${itemDto.product_id}" not found.`);
      }

      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(`Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${itemDto.quantity}`);
      }

      // Decrease stock
      product.stock -= itemDto.quantity;
      await this.productRepository.save(product); // This save is part of the transaction

      // Calculate total price
      totalPrice += product.price * itemDto.quantity;

      // Prepare order item
      const orderItem = this.orderItemRepository.create({
        product_id: product.id,
        quantity: itemDto.quantity,
        priceAtOrder: product.price,
      });
      orderItemsToCreate.push(orderItem);
    }

    // 3. Create the order
    const order = this.orderRepository.create({
      user_id: user.id,
      totalPrice: totalPrice,
      status: OrderStatus.PENDING,
    
    });
    const savedOrder = await this.orderRepository.save(order); // Save the main order

    // 4. Save order items, linking them to the new order
    for (const orderItem of orderItemsToCreate) {
      orderItem.order_id = savedOrder.id; // Link to the newly created order
      await this.orderItemRepository.save(orderItem); // This save is part of the transaction
    }

    return savedOrder
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOneWithDetails(id);
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  @Transaction()
  async cancelOrder(id: number): Promise<Order> {
    const order = await this.orderRepository.findOneWithDetails(id);
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(`Order cannot be cancelled. Current status: ${order.status}`);
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    // Optional: Return stock to products if order is cancelled
    for (const item of order.orderItems) {
      const product = await this.productRepository.findById(item.product_id);
      if (product) {
        product.stock += item.quantity;
        await this.productRepository.save(product);
      }
    }
    return order;
  }
}