// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'

import { Transaction } from 'src/core/decorators'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'
import { ProductRepository } from './repository/product.repository'

@Injectable()
export class ProductsService {
    constructor(private readonly productRepository: ProductRepository) {}

    @Transaction()
    async create(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = this.productRepository.create(createProductDto)
        return this.productRepository.save(newProduct)
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find()
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findById(id)
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`)
        }
        return product
    }

    @Transaction()
    async update(
        id: number,
        updateProductDto: UpdateProductDto,
    ): Promise<Product | null> {
        const product = await this.productRepository.findById(id)
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`)
        }
        return this.productRepository.update(id, updateProductDto)
    }

    @Transaction()
    async remove(id: number): Promise<void> {
        const product = await this.productRepository.findById(id)
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`)
        }
        await this.productRepository.delete(id)
    }
}
