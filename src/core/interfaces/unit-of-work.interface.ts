// src/core/interfaces/unit-of-work.interface.ts
import { EntityManager } from 'typeorm';
// We'll import actual repositories here later, e.g.:
// import { UserRepository } from '../../users/users.repository';
// import { ProductRepository } from '../../products/products.repository';

/**
 * Defines the contract for the Unit of Work.
 * It encapsulates transaction management and provides access to
 * transactional repositories.
 */
export interface IUnitOfWork {
  // Method to start a new database transaction
  startTransaction(): Promise<void>;

  // Method to commit the current transaction
  commit(): Promise<void>;

  // Method to rollback the current transaction
  rollback(): Promise<void>;

  // Provides access to the transactional EntityManager.
  // This is what repositories will use to ensure they operate within the current transaction.
  getManager(): EntityManager;

  // --- Add properties for your repositories here ---
  // Example:
  // userRepository: UserRepository;
  // productRepository: ProductRepository;
  // This approach makes the UnitOfWork instance a central point to get transactional repositories.
  // We'll define these properties more concretely when we implement the service and repositories.
}