import { LoggerService } from '@nestjs/common';

/**
 * A LoggerService extension requiring an `audit` method.
 */
export interface IAuditLogger extends LoggerService {
  /**
   * Write a log entry with an `AUDIT` level.
   * @param message The message to log, don't  mingle context with the message.
   * @param optionalParams Context required to  understand the message.
   */
  audit(message: any, ...optionalParams: any[]): any;
}
