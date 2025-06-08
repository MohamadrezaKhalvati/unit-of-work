// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { ProductRepository } from './repository/product.repository';


@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository, 
  ],
  exports: [ProductsService, ProductRepository],
})
export class ProductsModule {}