import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";

const logdir = path.join(__dirname, "..", "..", "log");
if (!fs.existsSync(logdir)) {
  fs.mkdirSync(logdir);
}

const errorLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: "console",
      colorize: true,
      level: "silly"
    }),
    new winston.transports.File({
      dirname: logdir,
      filename: "error.log",
      level: "error",
      name: "error-file"
    }),
    new winston.transports.File({
      dirname: logdir,
      filename: "info.log",
      level: "info",
      name: "info-file"
    })
  ],
  handleExceptions: true,
  exitOnError: true
});

const traceLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: "console",
      colorize: true,
      level: "silly"
    }),
    new winston.transports.File({
      dirname: logdir,
      filename: "trace.log",
      level: "silly",
      name: "trace-file"
    })
  ],
  handleExceptions: true,
  exitOnError: true
});

/*
if (process.env.NODE_ENV === "production") {
  errorLogger.remove("console");
  traceLogger.remove("console");
}
*/

export const logError = errorLogger.error;
export const logWarning = errorLogger.warn;
export const logInfo = errorLogger.info;
export const logVerbose = traceLogger.verbose;
export const logDebug = traceLogger.debug;
export const logSilly = traceLogger.silly;
