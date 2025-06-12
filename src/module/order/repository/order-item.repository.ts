// src/orders/order-items.repository.ts
import { Injectable } from '@nestjs/common'
import { BaseAbstractRepository } from 'src/core/base'
import { UnitOfWorkService } from 'src/core/unit-of-work'
import { OrderItem } from 'src/module/product/entities/order-item.entity'

@Injectable()
export class OrderItemRepository extends BaseAbstractRepository<OrderItem> {
    constructor(unitOfWork: UnitOfWorkService) {
        super(OrderItem, unitOfWork)
    }
}
