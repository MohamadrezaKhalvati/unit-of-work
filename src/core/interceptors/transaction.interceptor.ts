// src/core/interceptors/transaction.interceptor.ts
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TRANSACTION_KEY } from '../decorators/transaction.decorator';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
  
  /**
   * Interceptor to automatically manage database transactions for methods decorated with @Transaction().
   * It uses the UnitOfWorkService to start, commit, or rollback transactions.
   */
  @Injectable()
  export class TransactionInterceptor implements NestInterceptor {
	constructor(
	  private readonly reflector: Reflector,
	  private readonly unitOfWork: UnitOfWorkService, // UnitOfWorkService is Request-scoped
	) {}
  
	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
	  // Check if the current handler method is decorated with @Transaction()
	  const isTransactionEnabled = this.reflector.get<boolean>(
		TRANSACTION_KEY,
		context.getHandler(),
	  );
  
	  if (!isTransactionEnabled) {
		// If no @Transaction() decorator, proceed without transactional logic
		return next.handle();
	  }
  
	  // If @Transaction() is present, start a transaction
	  await this.unitOfWork.startTransaction();
  
	  return next.handle().pipe(
		tap(async () => {
		  // If the observable completes successfully, commit the transaction
		  await this.unitOfWork.commit();
		}),
		catchError(async (err) => {
		  // If an error occurs, rollback the transaction
		  await this.unitOfWork.rollback();
		  // Re-throw the error to be handled by other interceptors or global filters
		  return throwError(() => err);
		}),
	  );
	}
  }