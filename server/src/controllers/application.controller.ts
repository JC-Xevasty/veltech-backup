import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"

export const fetchApplication = asyncHandler(async (req: Request, res: Response) => {
   const application = await prisma.application.findFirst({})
   
   if (!application) {
      throw new Error("Unable to fetch application.")
   }

   res.status(200).json(application)
})

export const resetApplication = asyncHandler(async (req: Request, res: Response) => {
   const { id } = req.params
   
   const reset = await prisma.application.delete({
      where: {
         id
      }
   })

   if (!reset) {
      throw new Error("Unable to delete application.")
   }

   const application = await prisma.application.create({
      data: {
         appName: "Veltech Inc.",
         companyName: "Veltech Industrial Supression Inc.",
         companyAddress: "Metro Manila",
         companyContactNumber: "09123456789",
         companyEmailAddress: "veltech_inc@gmail.com"
      }
   })

   if (!application) {
      throw new Error("Unable to create application.")
   }

   res.status(201).json(application)
})

export const updateApplication = asyncHandler(async (req: Request, res: Response) => {
   const {
      companyName, companyAddress, companyContactNumber, companyEmailAddress,
      appName, logoPath, faviconPath, headerPath
   } = req.body

   const { id } = req.params
   
   const application = await prisma.application.update({
      where: {
         id
      },
      data: {
         companyName, companyAddress, companyContactNumber, companyEmailAddress,
         appName, logoPath, faviconPath, headerPath
      }
   })

   if (!application) {
      throw new Error("Unable to fetch or update application.")
   }

   res.status(200).json(application)
})