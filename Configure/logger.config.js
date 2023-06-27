const { format, createLogger, transports } = require("winston");
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level} : ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

if (process.env.ENV === "development") {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), logFormat),
    })
  );
}

module.exports.logger = logger;
