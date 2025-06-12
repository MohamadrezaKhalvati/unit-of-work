// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Transaction } from 'src/core/decorators'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UserRepository } from './repository/user.repository'

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}

    @Transaction()
    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
        const newUser = this.userRepository.create({
            email: createUserDto.email,
            password: hashedPassword,
            isActive: true,
        })
        return this.userRepository.save(newUser)
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`)
        }
        return user
    }

    @Transaction()
    async update(
        id: number,
        updateUserDto: UpdateUserDto,
    ): Promise<User | null> {
        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`)
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(
                updateUserDto.password,
                10,
            )
        }
        return this.userRepository.update(id, updateUserDto)
    }

    @Transaction()
    async remove(id: number): Promise<void> {
        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`)
        }
        await this.userRepository.delete(id)
    }
}
