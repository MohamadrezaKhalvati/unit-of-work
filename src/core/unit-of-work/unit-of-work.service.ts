// src/core/unit-of-work/unit-of-work.service.ts
import { Injectable, OnApplicationBootstrap, OnApplicationShutdown, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks'; // Node.js built-in module
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { IUnitOfWork } from '../interfaces/unit-of-work.interface';


// Define the store type that AsyncLocalStorage will hold
// It can hold the current EntityManager or QueryRunner for a transaction
type Store = { entityManager?: EntityManager; queryRunner?: QueryRunner };

@Injectable({ scope: Scope.REQUEST }) // IMPORTANT: New instance for each request
export class UnitOfWorkService implements IUnitOfWork, OnApplicationBootstrap, OnApplicationShutdown {
  // Use AsyncLocalStorage to manage the transactional context
  private readonly asyncLocalStorage = new AsyncLocalStorage<Store>();
  private _queryRunner: QueryRunner | null = null; // Stored for explicit commit/rollback

  // You will typically inject your repositories here
  // We'll add them dynamically or via a factory for flexibility
  // For now, we'll just demonstrate the UoW core functionality

  constructor(private readonly dataSource: DataSource) {}

  // Lifecycle hook: When the application starts, ensure the data source is ready
  async onApplicationBootstrap() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  // Lifecycle hook: When the application shuts down, gracefully close the data source
  async onApplicationShutdown() {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  /**
   * Starts a new database transaction.
   * Creates a QueryRunner and stores it in AsyncLocalStorage.
   */
  async startTransaction(): Promise<void> {
    if (this._queryRunner) {
      // If a transaction is already active (e.g., nested @Transaction),
      // we might want to log a warning or prevent starting a new one.
      // For now, we'll assume it's safe if the interceptor handles it.
      return;
    }

    this._queryRunner = this.dataSource.createQueryRunner();
    await this._queryRunner.connect();
    await this._queryRunner.startTransaction();

    // Enter an AsyncLocalStorage context with the transactional EntityManager
    this.asyncLocalStorage.enterWith({ entityManager: this._queryRunner.manager, queryRunner: this._queryRunner });
  }

  /**
   * Commits the current transaction.
   */
  async commit(): Promise<void> {
    const store = this.asyncLocalStorage.getStore();
    if (store && store.queryRunner && !store.queryRunner.isReleased) {
      await store.queryRunner.commitTransaction();
      await store.queryRunner.release(); // Release the query runner
    }
    this._queryRunner = null; // Clear the reference
    this.asyncLocalStorage.disable(); // Clear the store for the current context
  }

  /**
   * Rolls back the current transaction.
   */
  async rollback(): Promise<void> {
    const store = this.asyncLocalStorage.getStore();
    if (store && store.queryRunner && !store.queryRunner.isReleased) {
      await store.queryRunner.rollbackTransaction();
      await store.queryRunner.release(); // Release the query runner
    }
    this._queryRunner = null; // Clear the reference
    this.asyncLocalStorage.disable(); // Clear the store for the current context
  }

  /**
   * Returns the transactional EntityManager if a transaction is active,
   * otherwise returns the default EntityManager from the DataSource.
   */
  getManager(): EntityManager {
    const store = this.asyncLocalStorage.getStore();
    if (store && store.entityManager) {
      return store.entityManager;
    }
    // If no transaction is active, return the default manager
    return this.dataSource.manager;
  }

  // --- Methods to get transactional repositories ---
  // This is a common pattern to expose transactional repositories.
  // You would define concrete properties here for each repository.
  // For demonstration, we'll define a generic method.

  // NOTE: In a real application, you'd typically have properties like:
  // public userRepository: UserRepository;
  // public productRepository: ProductRepository;
  // And initialize them in the constructor by injecting them and
  // passing the `this` (UnitOfWorkService) to their constructors or a factory.
  // Or, a simpler approach is for repositories to simply call `getManager()` themselves.

  // Example of how you *might* get a transactional repository instance:
  // This is often handled by the repositories themselves when they call `getManager()`
  // but if you want to provide pre-instantiated transactional repos from UoW, you'd do:
  /*
  public getUserRepository(): UserRepository {
    // This would likely involve a factory or dynamic instantiation
    // based on the current entityManager from AsyncLocalStorage
    // For simplicity in the BaseAbstractRepository, repositories will just call getManager()
    throw new Error('Not implemented. Repositories should get manager directly from UoW service.');
  }
  */
}