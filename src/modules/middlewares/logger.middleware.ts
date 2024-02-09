import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger();

  use(req: Request, res: Response, next: NextFunction): void {
    const requestStart = Date.now();

    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const processingTime = Date.now() - requestStart;
      const forwardedIp =
        req.header('x-forwarded-for') || req.socket.remoteAddress;

      if (statusCode >= 200 && statusCode <= 300) {
        this.logger.log(
          JSON.stringify({
            method,
            originalUrl,
            statusCode,
            contentLength,
            userAgent,
            ip,
            processingTime: `${processingTime} ms`,
            forwardedIp,
          }),
        );
      }
      if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(
          JSON.stringify({
            method,
            originalUrl,
            statusCode,
            contentLength,
            userAgent,
            ip,
            processingTime: `${processingTime} ms`,
            forwardedIp,
          }),
        );
      }
      if (statusCode >= 500) {
        this.logger.error(
          JSON.stringify({
            method,
            originalUrl,
            statusCode,
            contentLength,
            userAgent,
            ip,
            processingTime: `${processingTime} ms`,
            forwardedIp,
          }),
        );
      }
    });

    next();
  }
}
