import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({level, message, timestamp, ...meta}) => {
            const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
            return `${timestamp} [${level.toUpperCase()}] ${message}${extra}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: "logs/app.log"}),
        new winston.transports.File({filename: "logs/error.log", level: "error"})
    ]
});

export default logger;
