// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { ProductsModule } from '../product/product.module';
import { UsersModule } from '../user/user.module';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { OrderItemRepository } from './repository/order-item.repository';
import { OrderRepository } from './repository/order.repository';

@Module({
  imports: [
   DatabaseModule,
    UsersModule,   
    ProductsModule, 
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderRepository,
    OrderItemRepository,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}