import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors, json } = format;

const env = process.env.NODE_ENV || "development";
const logLevel =
  process.env.LOG_LEVEL || (env === "development" ? "debug" : "info");

const devFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}${metaStr}`;
  }),
);

// Format JSON structuré pour la prod
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const logger = createLogger({
  level: logLevel,
  format: env === "development" ? devFormat : prodFormat,
  transports: [
    new transports.Console(),
    ...(env === "development"
      ? [new transports.File({ filename: "logs/combined.log" })]
      : []),
  ],
  exitOnError: false,
});

export default logger;
