import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"

export const resetSessions = asyncHandler(async (req: Request, res: Response) => {
  const reset = await prisma.session.deleteMany({})

  if (!reset) {
    throw new Error("Failed to reset session.")
  }

  req.session.destroy(() => {
    res.clearCookie("connect.sid")
  })

  res.status(200).json(reset)
})

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {

})