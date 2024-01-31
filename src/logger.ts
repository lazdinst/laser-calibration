import winston from "winston";

const logColors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  success: "green",
  debug: "blue",
};

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    success: 3,
    debug: 5,
  },
};

const myFormat = winston.format.printf(
  ({ level, message, context, timestamp }) => {
    return `[${timestamp}] ${level} : ${context} : ${message}`;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize({
      all: true,
      colors: logColors,
    }),
    winston.format.timestamp(),
    winston.format.simple(),
    myFormat
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
