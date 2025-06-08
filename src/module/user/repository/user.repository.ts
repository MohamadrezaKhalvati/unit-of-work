// src/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from 'src/core/base';
import { UnitOfWorkService } from 'src/core/unit-of-work';
import { User } from '../entities/user.entity';


@Injectable()
export class UserRepository extends BaseAbstractRepository<User> {
  constructor(unitOfWork: UnitOfWorkService) {
    super(User, unitOfWork);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
}