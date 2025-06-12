// src/users/users.controller.ts
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
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UsersService } from './user.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully created.',
        type: User,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request (validation errors)',
    })
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all users' })
    @ApiResponse({ status: 200, description: 'List of users.', type: [User] })
    async findAll(): Promise<User[]> {
        return this.usersService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a user by ID' })
    @ApiResponse({ status: 200, description: 'The found user.', type: User })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(Number(id))
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully updated.',
        type: User,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request (validation errors)',
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User | null> {
        return this.usersService.update(Number(id), updateUserDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({
        status: 204,
        description: 'The user has been successfully deleted.',
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        await this.usersService.remove(Number(id))
    }
}
