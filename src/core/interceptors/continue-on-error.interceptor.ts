import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ContinueOnErrorInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ContinueOnErrorInterceptor.name)

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error: any): Observable<any> => {
                if (error instanceof BadRequestException) {
                    this.logger.warn(
                        `Bad request error intercepted: ${error.message}`,
                    )

                    return of({
                        warning: 'Bad request handled, flow continues',
                    })
                }
                // Re-throw other types of errors
                throw error
            }),
        )
    }
}
