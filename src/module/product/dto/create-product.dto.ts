import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Pro', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Powerful laptop for professionals.', description: 'Product description', required: false })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ example: 1200.50, description: 'Price of the product' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, description: 'Current stock quantity' })
  @IsNumber()
  @Min(0)
  stock: number;
}