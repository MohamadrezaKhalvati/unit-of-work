// src/users/users.module.ts
import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/core/database/database.module'
import { UserRepository } from './repository/user.repository'
import { UsersController } from './user.controller'
import { UsersService } from './user.service'

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [UsersService, UserRepository],
    exports: [UsersService, UserRepository],
})
export class UsersModule {}
