// src/orders/orders.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from 'src/core/base';
import { UnitOfWorkService } from 'src/core/unit-of-work';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends BaseAbstractRepository<Order> {
  constructor(unitOfWork: UnitOfWorkService) {
    super(Order, unitOfWork);
  }

  async findOneWithDetails(id: number): Promise<Order | null> {
    return this.findOne({
      where: { id: id },
      relations: ['orderItems', 'user', 'orderItems.product'], 
    });
  }
}