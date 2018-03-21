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

export const error = logger.error;
export const warn = logger.warn;
export const info = logger.info;
export const verbose = logger.verbose;
export const debug = logger.debug;
export const silly = logger.silly;
