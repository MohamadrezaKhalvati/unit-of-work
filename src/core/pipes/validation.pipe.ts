// src/core/pipes/validation.pipe.ts
import {
    ArgumentMetadata,
    BadRequestException,
    HttpStatus,
    Injectable,
    PipeTransform,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }

        const object = plainToInstance(metatype, value)
        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
        })

        if (errors.length > 0) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Validation failed',
                errors: errors
                    .map(error => Object.values(error.constraints || {}))
                    .flat(),
            })
        }
        return value
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }
}
