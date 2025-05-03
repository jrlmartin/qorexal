// import newrelic from 'newrelic';

import fs from 'fs';
import util from 'util';
import { LoggerService } from '@nestjs/common';
import { IAuditLogger } from './types';
// Enhanced chalk implementation for prettier logs
const chalk = {
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  white: (text: string) => `\x1b[37m${text}\x1b[0m`,
  gray: (text: string) => `\x1b[90m${text}\x1b[0m`,
  bgRed: (text: string) => `\x1b[41m${text}\x1b[0m`,
  bgGreen: (text: string) => `\x1b[42m${text}\x1b[0m`,
  bgYellow: (text: string) => `\x1b[43m${text}\x1b[0m`,
  bgBlue: (text: string) => `\x1b[44m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
  italic: (text: string) => `\x1b[3m${text}\x1b[0m`,
  underline: (text: string) => `\x1b[4m${text}\x1b[0m`,
};

// https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
// This will fix most of the errors not logging in the console becasue they are normally stripped out of stringify.
if (!('toJSON' in Error.prototype))
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      const alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });

/**
 * The log levels that can be used.
 */
export enum LogLevel {
  VERBOSE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

const PSEUDO_LEVEL_AUDIT = 'audit';
const DEFAULT_LOG_LEVEL = LogLevel[LogLevel.DEBUG];

// Ensure util is imported and available
const safeInspect = (obj: any): string => {
  try {
    return util && typeof util.inspect === 'function' 
      ? util.inspect(obj, { 
          depth: null, // Show all nested objects (no depth limit)
          colors: true, // Enable colors
          maxArrayLength: null, // Show all array elements
          maxStringLength: null, // Show complete strings
          compact: false, // Pretty format with newlines
          showHidden: false // Don't show non-enumerable properties
        })
      : JSON.stringify(obj, null, 2);
  } catch (e) {
    return String(obj);
  }
};

// Limit json objects to 10 levels of nesting
export const prune = (obj, depth = 10) => {
  try {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj) && obj.length > 0) {
      return depth === 0 ? ['???'] : obj.map((e) => prune(e, depth - 1));
    } else if (obj && typeof obj === 'object' && Object.keys(obj).length > 0) {
      return depth === 0
        ? { '???': '' }
        : Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: prune(obj[key], depth - 1) }), {});
    } else {
      return obj;
    }
  } catch (e) {
    return '[Circular or unprunable object]';
  }
};

/**
 * A structured logger that writes to the NestJS `Logger`.
 */
export class AppLogger implements LoggerService, IAuditLogger {
  /**
   * A default logger to use when no other logger is appropriate or available.
   */
  public static readonly Default = new AppLogger('Default');

  // Private constructor to prevent direct instantiation
  public constructor(
    protected readonly name: string,
    ) {}

  private static _loggers: { [name: string]: AppLogger } = {};

  private _minLevel: LogLevel = LogLevel[process.env.LOG_LEVEL] ?? LogLevel[DEFAULT_LOG_LEVEL];

  private _disable_structured_logs: boolean =
    process.env.NODE_ENV !== 'test' && process.env.DISABLE_STRUCTURED_LOGS?.toLowerCase() == 'true';

  private _enable_file_logger: boolean =
    process.env.NODE_ENV !== 'test' && process.env.ENABLE_FILE_LOGGER?.toLowerCase() == 'true';

  private _enable_console_logger: boolean =
    process.env.NODE_ENV !== 'test' && process.env.ENABLE_CONSOLE_LOGGER?.toLowerCase() !== 'false';

  /**
   * Gets the minimum log level that will be logged.
   */
  get level(): LogLevel {
    return this._minLevel;
  }

  /**
   * Sets the minimum log level that will be logged.
   */
  set level(level: string | number | LogLevel) {
    this._minLevel = typeof level === 'string' ? LogLevel[level] : level;
  }

  // Setter for log level
  // Method to get logger instance for a specific name
  public static for(name: string) {
    const logger = new AppLogger(name);
    AppLogger._loggers[name] = logger;
    return logger;
  }

  /**
   * Write an `AUDIT` level log entry.
   * @param message The message to write. Don't mingle context here, use `optionalParams` instead.
   * @param optionalParams Any optional parameters to write with the `message`. This should be context data.
   */
  audit(message: any, ...optionalParams: any[]) {
    this.consoleOut(message, PSEUDO_LEVEL_AUDIT, optionalParams);
  }

  /**
   * **DEPRECATED** - Write an `INFO` level log entry.
   * @param message The message to write. Don't mingle context here, use `optionalParams` instead.
   * @param optionalParams Any optional parameters to write with the `message`. This should be context data.
   * @deprecated Use `info`, or another level appropriate method instead.
   */
  log(message: any, ...optionalParams: any[]) {
    this.info(message, optionalParams);
  }

  /**
   * Write an `INFO` level log entry.
   * @param message The message to write. Don't mingle context here, use `optionalParams` instead.
   * @param optionalParams Any optional parameters to write with the `message`. This should be context data.
   */
  info(message: any, ...optionalParams: any[]) {
    const colorization = optionalParams[0];
    // Simplified color handling
    if (process.env.NODE_ENV === 'development' && colorization) {
      console.log(message);
    } else {
      this.consoleOut(message, 'info', optionalParams);
    }
  }

  /**
   * Write an `ERROR` level log entry.
   * @param message The message to write. Don't mingle context here, use `optionalParams` instead.
   * @param optionalParams Any optional parameters to write with the `message`. This should be context data.
   */
  error(message: any, ...optionalParams: any[]) {
    this.consoleOut(message, 'error', optionalParams);
  }

  /**
   * Write a `WARN` level log entry.
   * @param message The message to write. Don't mingle context here, use `optionalParams` instead.
   * @param optionalParams Any optional parameters to write with the `message`. This should be context data.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.consoleOut(message, 'warn', optionalParams);
  }

  /**
   * Write a `DEBUG` level log entry.
   * @param message The message to write. Don't mingle context here, use `optionalParams` instead.
   * @param optionalParams Any optional parameters to write with the `message`. This should be context data.
   */
  debug?(message: any, ...optionalParams: any[]) {
    this.consoleOut(message, 'debug', optionalParams);
  }

  /**
   * Write a `VERBOSE` level log entry.
   * @param message The message to write. Don't mingle context here, use `optionalParams` instead.
   * @param optionalParams Any optional parameters to write with the `message`. This should be context data.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    this.consoleOut(message, 'verbose', optionalParams);
  }

  /**
   * If the `level` can be logged under the current configuration, writes an `ILogEntry` to the NestJS `Logger`, otherwise nothing.
   * @param message The message to write.
   * @param level The level at which to write the `message`.
   * @param optionalParams Any optional parameters to write with the `message`.
   */
  private consoleOut(message: string, level: string, optionalParams: any[] = []) {
    try {
      if (!this.canLogLevel(level)) return;

      let entry: ILogEntry = {
        name: this.name,
        message: typeof message === 'string' ? message : String(message),
        level: level,
        time: new Date().toISOString(),
      };
      
      const optionalPart = optionalParams.length ? optionalParams[0] : {};

      // This is the ONLY place where `console` is allowed to be used.
      if (this._disable_structured_logs) {
        try {
          // Use the safe inspect function
          const inspectedData = safeInspect({
            ...entry,
            extra: optionalPart,
          });
          
          // eslint-disable-next-line no-console
          console.log(chalk.bold(chalk.cyan('<<<< ===================== Marcie Logger ===================== >>>>')));
          console.log(chalk.dim('Timestamp:'), chalk.yellow(entry.time || new Date().toISOString()));
          console.log(chalk.dim('Logger:'), chalk.green(entry.name));
          console.log(chalk.dim('Level:'), getLevelColor(entry.level)(entry.level.toUpperCase()));
          console.log(chalk.dim('Message:'), chalk.white(entry.message));
          console.log(chalk.dim('Details:'));
          
          // eslint-disable-next-line no-console
          console.log(inspectedData);
          console.log(chalk.cyan('<<<< =============================================================== >>>>'));
        } catch (inspectErr) {
          console.log(`${chalk.bgRed('Error in structured logging:')} ${inspectErr.message}`);
        }
      } else {
        // This is the ONLY place where `console` is allowed to be used.
        if (this._enable_console_logger) {
          try {
            const devError = entry.level == 'error' && process.env.NODE_ENV === 'development';
            let indent = 0;
            if (devError) indent = 2;
            
            const safeData = prune({
              ...entry,
              extra: optionalPart,
            });
            
            let outputActual = JSON.stringify(safeData, null, indent);
            
            if (devError)
              outputActual =
                '\n>>>>> Error >>>>>\n' +
                outputActual +
                '\n<<<<< Error <<<<<<\n';
                
            // eslint-disable-next-line no-console
            console.log(outputActual);
          } catch (e) {
            // Fallback to a simpler output format if JSON stringification fails
            console.log(`[${level.toUpperCase()}][${this.name}] ${message}`);
            if (e instanceof Error) {
              console.log(`Error stringifying log entry: ${e.message}`);
            }
          }
        }
      }

      if (this._enable_file_logger) {
        try {
          const safeEntry = prune(entry);
          const str = JSON.stringify(safeEntry);
          fs.appendFile('AppLogger.log', `\n${str}`, (err) => {
            if (err) {
              // Just log the error to console without throwing
              console.error(`Failed to write to log file: ${err.message}`);
            }
          });
        } catch (fileErr) {
          console.error(`Error preparing entry for file logging: ${fileErr.message}`);
        }
      }
    } catch (unexpectedErr) {
      // Last resort fallback to prevent app crashes due to logging
      try {
        console.error(`Critical logger error: ${unexpectedErr.message}`);
      } catch {
        // Nothing more we can do
      }
    }
  }

  /**
   * Determines whether or not the given `level` is allowed to be logged.
   * @param level The level to check.
   * @returns `true` if the `level` is allowed to be logged, otherwise `false`.
   * @remarks `audit` is always allowed to be logged.
   */
  private canLogLevel(level: string): boolean {
    if (level === PSEUDO_LEVEL_AUDIT) return true;

    const setLevel = Number(this._minLevel);
    const checkLevel = LogLevel[level.toUpperCase()];
    if (checkLevel === undefined || checkLevel < 0) return false;

    return checkLevel >= setLevel;
  }
}

/**
 * A structured log entry.
 */
export interface ILogEntry {
  name: string;
  message: string;
  level: string;
  time?: string;
  extra?: any;
  error?: {
    name: string;
    message: string;
    stack: string;
  };
}

/**
 * Gets the appropriate chalk color function based on log level
 * @param level The log level
 * @returns A chalk color function
 */
function getLevelColor(level: string): (text: string) => string {
  switch(level.toLowerCase()) {
    case 'error': return chalk.red;
    case 'warn': return chalk.yellow;
    case 'info': return chalk.green;
    case 'debug': return chalk.blue;
    case 'verbose': return chalk.magenta;
    case PSEUDO_LEVEL_AUDIT: return chalk.cyan;
    default: return chalk.white;
  }
}
