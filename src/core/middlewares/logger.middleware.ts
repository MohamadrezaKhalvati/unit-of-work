// src/core/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.originalUrl}`);
    // You could add more sophisticated logging here, e.g., log request body, headers
    next();
  }
}