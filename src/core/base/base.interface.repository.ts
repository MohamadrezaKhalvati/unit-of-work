import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm'

export interface IBaseRepository<T> {
    create(entity: DeepPartial<T>): T
    save(entity: T): Promise<T>
    saveMany(entities: T[]): Promise<T[]>
    findOne(options: FindOneOptions<T>): Promise<T | null>
    find(options?: FindManyOptions<T>): Promise<T[]>
    findById(id: string): Promise<T | null>
    update(id: string, partialEntity: DeepPartial<T>): Promise<T | null>
    delete(id: string): Promise<void>
    softDelete(id: string): Promise<void>
}
