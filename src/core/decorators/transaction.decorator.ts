import { SetMetadata } from '@nestjs/common'

export const TRANSACTION_KEY = 'transaction_enabled'
export function Transaction(): MethodDecorator {
    return SetMetadata(TRANSACTION_KEY, true)
}
