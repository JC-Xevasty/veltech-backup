import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"

export const fetchNotifications = asyncHandler(async (req: Request, res: Response) => {
   const { userId } = req.params

   if (!userId) {
      throw new Error("Incomplete or invalid input.")
   }

   const fetch = await prisma.notification.findMany({
      where: {
         userId
      },
      orderBy: {
         createdAt: "desc"
      }
   })

   if (!fetch) {
      throw new Error("Unable to fetch quotation notifications.")
   }

   res.status(200).json(fetch)
})

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
   const { origin, body, title, userId, quotationId, projectId } = req.body

   if (!origin || !body || !title || !userId) {
      throw new Error("Incomplete or invalid input.")
   }

   const create = await prisma.notification.create({
      data: {
         origin,
         body,
         title,
         user: {
            connect: {
               id: userId
            }
         },
         quotationId,
         projectId
      }
   })

   if (!create) {
      throw new Error("Unable to create new quotation notification.")
   }

   res.status(201).json(create)
})