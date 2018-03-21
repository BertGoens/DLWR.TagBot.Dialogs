import * as winston from "winston";

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: "console",
      colorize: true,
      level: "silly"
    })
  ],
  handleExceptions: true,
  exitOnError: true
});

if (process.env.NODE_ENV === "production") {
  logger.remove("console");
}

export const error = logger.error;
export const warn = logger.warn;
export const info = logger.info;
export const verbose = logger.verbose;
export const debug = logger.debug;
export const silly = logger.silly;
