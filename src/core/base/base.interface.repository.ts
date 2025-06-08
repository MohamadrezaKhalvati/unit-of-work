// src/core/base/base.interface.repository.ts
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

/**
 * Defines the common contract for a base repository.
 * T is the entity type.
 */
export interface IBaseRepository<T> {
  create(entity: DeepPartial<T>): T;
  save(entity: T): Promise<T>;
  saveMany(entities: T[]): Promise<T[]>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  update(id: string, partialEntity: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>; // For soft-deletes
  // You might add more specific methods here, e.g., for pagination
}