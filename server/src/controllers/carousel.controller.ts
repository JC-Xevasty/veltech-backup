import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"
import { Carousel_Status } from "@prisma/client"

export const createEntry = asyncHandler(async (req: Request, res: Response) => {
   const { title, description, imgPath } = req.body

   if (!title || !description || !imgPath) {
      throw new Error("Incomplete or invalid input.")
   }

   const create = await prisma.carousel.create({
      data: {
         title, description, imgPath, status: Carousel_Status.ACTIVE
      },
      select: {
         id: true
      }
   })

   if (!create) {
      throw new Error("Unable to create new carousel entry.")
   }

   res.status(201).json(create)
})

export const fetchEntry = asyncHandler(async (req: Request, res: Response) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Incomplete or invalid input.")
   }

   const fetch = await prisma.carousel.findUnique({
      where: {
         id
      }
   })

   if (!fetch) {
      throw new Error("Unable to fetch carousel entry.")
   }

   res.status(200).json(fetch)
})

export const fetchEntries = asyncHandler(async (req: Request, res: Response) => {
   const fetch = await prisma.carousel.findMany()

   if (!fetch) {
      throw new Error("Unable to fetch carousel entries.")
   }

   res.status(200).json(fetch)
})

export const updateEntry = asyncHandler(async (req: Request, res: Response) => {
   const { id } = req.params

   const { title, description, imgPath } = req.body

   if (!id || !title || !description || !imgPath) {
      throw new Error("Incomplete or invalid input.")
   }

   const update = await prisma.carousel.update({
      where: {
         id
      },
      data: {
         title,
         description,
         imgPath
      },
      select: {
         id: true
      }
   })

   if (!update) {
      throw new Error("Unable to update carousel entry.")
   }

   res.status(200).json(update)
})

export const updateEntryStatus = asyncHandler(async (req: Request, res: Response) => {
   const { id } = req.params

   const { status } = req.body

   if (!id || !status) {
      throw new Error("Incomplete or invalid input.")
   }

   const update = await prisma.carousel.update({
      where: {
         id
      },
      data: {
         status
      },
      select: {
         id: true
      }
   })

   if (!update) {
      throw new Error("Unable to update carousel entry status.")
   }

   res.status(200).json(update)
})