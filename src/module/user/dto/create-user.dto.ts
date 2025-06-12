import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
    @ApiProperty({ example: 'test@example.com', description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        example: 'SecurePassword123!',
        description: 'User password',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string
}
