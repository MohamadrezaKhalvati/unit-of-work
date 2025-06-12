import { Injectable } from '@nestjs/common'
import { BaseAbstractRepository } from 'src/core/base'
import { UnitOfWorkService } from 'src/core/unit-of-work'
import { Product } from '../entities/product.entity'

@Injectable()
export class ProductRepository extends BaseAbstractRepository<Product> {
    constructor(unitOfWork: UnitOfWorkService) {
        super(Product, unitOfWork)
    }
}
