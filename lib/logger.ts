import winston from "winston";
import path from "node:path";
import fs from "node:fs";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Human readable format for console
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
});

// Determine if running in a serverless environment (Vercel, AWS Lambda, Netlify, etc.)
// In serverless environments, file writing to /var/task is prohibited and disk is ephemeral.
const isServerless =
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.LAMBDA_TASK_ROOT) ||
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_RUNTIME === "edge";

const transports: winston.transport[] = [
  // Console output with colors (captured by Vercel / server logs natively)
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: "HH:mm:ss" }),
      consoleFormat
    ),
  }),
];

// Only enable file transports in persistent local environments (never on Vercel/serverless)
if (!isServerless && typeof window === "undefined") {
  try {
    const logDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, "error.log"),
        level: "error",
        maxsize: 5 * 1024 * 1024, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: path.join(logDir, "combined.log"),
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
      })
    );
  } catch (err) {
    // If directory creation or file transport fails, fallback gracefully to console-only
    console.warn("Winston file logging disabled due to filesystem constraints:", err);
  }
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: "greenland-estates" },
  transports,
});

export default logger;

