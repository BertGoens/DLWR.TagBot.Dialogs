import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";

const logdir = path.join(__dirname, "..", "..", "log");
if (!fs.existsSync(logdir)) {
  fs.mkdirSync(logdir);
}

const logger = new winston.Logger({
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
    }),
    new winston.transports.File({
      dirname: logdir,
      filename: "debug.log",
      level: "debug",
      name: "debug-file"
    })
  ],
  handleExceptions: true,
  exitOnError: true
});

/*
if (process.env.NODE_ENV === "production") {
  logger.remove("console");
}
*/

export const logError = logger.error;
export const logWarning = logger.warn;
export const logInfo = logger.info;
export const logVerbose = logger.verbose;
export const logDebug = logger.debug;
export const logSilly = logger.silly;
