// src/core/decorators/transaction.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for identifying methods that require a transaction.
 * Used by the TransactionInterceptor.
 */
export const TRANSACTION_KEY = 'transaction_enabled';

/**
 * Decorator to mark a service method as transactional.
 * When applied, the TransactionInterceptor will automatically
 * start a transaction before the method executes and commit/rollback
 * it upon completion/error.
 */
export function Transaction(): MethodDecorator {
  return SetMetadata(TRANSACTION_KEY, true);
}