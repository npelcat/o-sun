import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const env: string = process.env.NODE_ENV || "development";

const logger = createLogger({
  level: env === "development" ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    ...(env === "development"
      ? [new transports.File({ filename: "logs/combined.log" })]
      : []),
  ],
  exitOnError: false,
});

export default logger;
