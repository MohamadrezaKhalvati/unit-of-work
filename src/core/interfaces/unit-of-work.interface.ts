import { ProductRepository } from 'src/module/product/repository/product.repository'
import { UserRepository } from 'src/module/user/repository/user.repository'
import { EntityManager } from 'typeorm'

export interface IUnitOfWork {
    startTransaction(): Promise<void>

    commit(): Promise<void>

    rollback(): Promise<void>

    getManager(): EntityManager

    userRepository: UserRepository
    productRepository: ProductRepository
}
