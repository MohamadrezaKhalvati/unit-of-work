import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm'

export interface IBaseRepository<T> {
    create(entity: DeepPartial<T>): T
    save(entity: T): Promise<T>
    saveMany(entities: T[]): Promise<T[]>
    findOne(options: FindOneOptions<T>): Promise<T | null>
    find(options?: FindManyOptions<T>): Promise<T[]>
    findById(id: number): Promise<T | null>
    update(id: number, partialEntity: DeepPartial<T>): Promise<T | null>
    delete(id: number): Promise<void>
    softDelete(id: number): Promise<void>
}
