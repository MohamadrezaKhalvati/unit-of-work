// src/products/products.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'
import { ProductsService } from './product.service'

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({
        status: 201,
        description: 'The product has been successfully created.',
        type: Product,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request (validation errors)',
    })
    async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto)
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all products' })
    @ApiResponse({
        status: 200,
        description: 'List of products.',
        type: [Product],
    })
    async findAll(): Promise<Product[]> {
        return this.productsService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a product by ID' })
    @ApiResponse({
        status: 200,
        description: 'The found product.',
        type: Product,
    })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async findOne(@Param('id') id: string): Promise<Product> {
        return this.productsService.findOne(Number(id))
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product by ID' })
    @ApiResponse({
        status: 200,
        description: 'The product has been successfully updated.',
        type: Product,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request (validation errors)',
    })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<Product | null> {
        return this.productsService.update(Number(id), updateProductDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a product by ID' })
    @ApiResponse({
        status: 204,
        description: 'The product has been successfully deleted.',
    })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        await this.productsService.remove(Number(id))
    }
}
