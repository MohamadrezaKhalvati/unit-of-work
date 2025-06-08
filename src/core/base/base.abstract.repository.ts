// src/core/base/base.abstract.repository.ts
import {
    DeepPartial,
    EntityTarget,
    FindManyOptions,
    FindOneOptions,
    Repository,
} from 'typeorm'
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service' // Adjust path
import { BaseEntity } from './base.entity' // Adjust path
import { IBaseRepository } from './base.interface.repository'

export abstract class BaseAbstractRepository<T extends BaseEntity>
    implements IBaseRepository<T>
{
    private readonly _repository: Repository<T>

    constructor(
        private entity: EntityTarget<T>,
        protected readonly unitOfWork: UnitOfWorkService,
    ) {
        this._repository = this.unitOfWork
            .getManager()
            .getRepository(this.entity)
    }

    create(entity: DeepPartial<T>): T {
        return this._repository.create(entity)
    }

    async save(entity: T): Promise<T> {
        return this._repository.save(entity)
    }

    async saveMany(entities: T[]): Promise<T[]> {
        return this._repository.save(entities)
    }

    async findOne(options: FindOneOptions<T>): Promise<T | null> {
        return this._repository.findOne(options)
    }

    async find(options?: FindManyOptions<T>): Promise<T[]> {
        return this._repository.find(options)
    }

    async findById(id: string): Promise<T | null> {
        return this._repository.findOne({
            where: { id: id as any },
        } as FindOneOptions<T>)
    }

    async update(id: string, partialEntity: DeepPartial<T>): Promise<T | null> {
        await this._repository.update(id, partialEntity as any)
        return this.findById(id)
    }

    async delete(id: string): Promise<void> {
        await this._repository.delete(id)
    }

    async softDelete(id: string): Promise<void> {
        await this._repository.softDelete(id)
    }
}
