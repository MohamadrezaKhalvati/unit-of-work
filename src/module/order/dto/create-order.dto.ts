// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    Min,
} from 'class-validator'

export class OrderItemDto {
    @ApiProperty({ example: '1', description: 'Product ID' })
    @IsNumber()
    @IsNotEmpty()
    product_id: number

    @ApiProperty({ example: 2, description: 'Quantity of the product' })
    @IsInt()
    @Min(1)
    quantity: number
}

export class CreateOrderDto {
    @ApiProperty({
        example: '1',
        description: 'ID of the user placing the order',
    })
    @IsNumber()
    user_id: number

    @ApiProperty({
        type: [OrderItemDto],
        description: 'List of items in the order',
    })
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}
