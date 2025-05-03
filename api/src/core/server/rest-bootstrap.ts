import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
 
// Your root module
import { AppLogger, AllExceptionsFilter } from '../logger'; // Your custom logger/filter

/**
 * Function to bootstrap a NestJS app (Fastify) with all the goodies:
 * - @fastify/multipart
 * - Swagger
 * - Custom logging
 * - Global pipes/filters
 * - Graceful shutdown
 */
export async function restBootstrap({
  module,
  apiName,
  apiVersion,
  globalPrefix = 'api',
  host = '0.0.0.0',
  port = 9001,
}: {
  module?: any;
  apiName: string;
  apiVersion: string;
  globalPrefix?: string;
  host?: string;
  port?: number;
}): Promise<NestFastifyApplication> {
  // Create a logger
  const logger = AppLogger.for('Bootstrap');

  // Create the NestJS Fastify app with built-in logging
  // @ts-ignore
  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    new FastifyAdapter({
      logger: true,
      requestIdHeader: 'request-id',
      requestIdLogLabel: 'request_id',
    }),
    { logger: logger },
  );

  // await app.register(multipart, {
  //   // Optionally pass limits or addToBody, etc.
  //   // limits: { fileSize: 10_000_000 }, // 10 MB
  // });


  // CORS
  app.enableCors({ maxAge: 86400 });

  // Global prefix
  app.setGlobalPrefix(globalPrefix);

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      forbidUnknownValues: true,
    }),
  );

  // Link DI container to class-validator
  useContainer(app.select(module), { fallbackOnErrors: true });
 
  // Log relevant info
  logger.info(`API: ${apiName}`);
  logger.info(`API Version: ${apiVersion}`);
  logger.info(`Configured Host: ${host}`);
  logger.info(`Configured Port: ${port}`);
  logger.info(`Swagger UI available at http://${host}:${port}/swf`);
  logger.info(`Swagger JSON available at http://${host}:${port}/swf-json`);
  logger.info(`Process PID: ${process.pid}`, 'yellow');

  // Start listening

  try {
    await app.listen(port, host, () => {
      logger.info(`Listening at http://${host}:${port}/${globalPrefix}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
  }

  return app;
}
