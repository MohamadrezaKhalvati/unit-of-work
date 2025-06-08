// src/core/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route as public, bypassing authentication.
 * Useful for login, registration, etc.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);