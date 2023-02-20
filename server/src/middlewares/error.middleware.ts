import { NextFunction, Request, Response } from "express"
import { config } from "dotenv"

config()

interface ErrorHandler {
  message: String,
  stack?: String
}

export const errorHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    })
  }

  next()
}