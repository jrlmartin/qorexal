let newrelic = null;
import * as dotenv from 'dotenv';
dotenv.config();

try {
  if (process.env.NEWRELIC_ENABLED?.toLowerCase() === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    newrelic = require('newrelic');
  }
} catch (error) {
  console.error('Failed to load newrelic module:', error);
}

/**
 * A method decorator that logs method invocations.
 * @param message The log message to be prefixed before the method invocation.
 * @returns A method decorator that logs the call and its arguments.
 */
function LogMethod(message: string): MethodDecorator {
  return function (target, propertyName, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    // Override the original method to add logging behavior
    descriptor.value = function (...args: any[]) {
      // Log the method call with provided message and arguments

      // @ts-ignore
      this.logger.info(`Calling Method: ${propertyName}`, { method: propertyName });

      // Execute the original method and return its result
      const result = originalMethod.apply(this, args);
      return result;
    };
  };
}

/**
 * Decorator for creating a New Relic segment around a method, allowing for performance monitoring.
 * @returns A method decorator that wraps the method call in a New Relic segment.
 */
export function NewRelicSegment() {
  return function (
    _target: Object,
    propertyName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    const originalMethod = descriptor.value;

    return originalMethod;

    // Don't wrap functions when testing
    if (process.env.NEWRELIC_ENABLED != 'true') return originalMethod;

    // Modify the method to include it in a New Relic segment for monitoring
    descriptor.value = async function (...args: any[]) {
      const segmentName = `${this.constructor.name}_${String(propertyName)}`;

      // Start and return a New Relic segment that wraps the original method call
      return newrelic.startSegment(segmentName, false, async () => {
        return await originalMethod.apply(this, args);
      });
    };
  };
}

/**
 * Combines both logging and New Relic segment creation into a single decorator.
 * @param msg The message to log upon method invocation.
 * @returns A method decorator that logs the call and wraps it in a New Relic segment.
 */
export function LogAndNewRelicSegment(msg?: string): MethodDecorator {
  return function (target, propertyKey: string | symbol, descriptor) {
    // Apply both decorators to the method, with NewRelicSegment first to ensure it wraps the logging
    if (newrelic) {
      NewRelicSegment()(target, propertyKey, descriptor);
    }
    LogMethod(msg)(target, propertyKey, descriptor);
  };
}
