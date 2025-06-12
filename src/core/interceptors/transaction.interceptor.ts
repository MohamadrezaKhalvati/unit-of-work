import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { TRANSACTION_KEY } from '../decorators/transaction.decorator'
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly unitOfWork: UnitOfWorkService,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const isTransactionEnabled = this.reflector.get<boolean>(
            TRANSACTION_KEY,
            context.getHandler(),
        )

        if (!isTransactionEnabled) {
            return next.handle()
        }

        await this.unitOfWork.startTransaction()

        return next.handle().pipe(
            tap(async () => {
                await this.unitOfWork.commit()
            }),
            catchError(async err => {
                await this.unitOfWork.rollback()
                return throwError(() => err)
            }),
        )
    }
}
