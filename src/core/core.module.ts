// src/core/core.module.ts
import { Global, Module, Scope } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { TransactionInterceptor } from './interceptors/transaction.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';
import { UnitOfWorkService } from './unit-of-work/unit-of-work.service';
import { IsUniqueConstraint } from './validator';



@Global()
@Module({
  imports: [
  ],
  providers: [
    UnitOfWorkService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor, 
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, 
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe, 
    },
    {
      provide: IsUniqueConstraint,
      useClass: IsUniqueConstraint,
      scope: Scope.REQUEST,
    },
  ],
  exports: [
		UnitOfWorkService,
  ],
})
export class CoreModule {}