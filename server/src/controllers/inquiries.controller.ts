import { RequestHandler } from "express"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"
import { filter, orderBy } from "lodash"

export const fetchInquiry: RequestHandler = asyncHandler(async (req, res) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Unable to fetch inquiry.")
   }

   const fetch = await prisma.contact.findUnique({
      where: {
         id
      }
   })

   if (!fetch) {
      throw new Error("Unable to fetch inquiry.")
   }

   res.status(200).json(fetch)
})

export const fetchInquiries: RequestHandler = asyncHandler(async (req, res) => {
   const { search } = req.body
   
   let fetch = await prisma.contact.findMany({})

   if (!fetch) {
      throw new Error("Unable to fetch inquiries.")
   }

   fetch = filter(fetch, inquiry => {
      const regex = new RegExp(search, "i")
      return regex.test(inquiry.fullName) || regex.test(inquiry.companyName)
   })

   fetch = orderBy(fetch, ["isReplied", "createdAt"], ["asc", "desc"])

   res.status(200).json(fetch)
})

export const createInquiry: RequestHandler = asyncHandler(async (req, res) => {
   const { subject, fullName, companyName, emailAddress, message } = req.body

   if (!subject || !fullName || !companyName || !emailAddress || !message) {
      throw new Error("Unable to create inquiry.")
   }

   const create = await prisma.contact.create({
      data: {
         subject, fullName, companyName, emailAddress, message
      }
   })

   if (!create) {
      throw new Error("Unable to create inquiry.")
   }

   res.status(201).json(create)
})

export const updateInquiryIsReplied: RequestHandler = asyncHandler(async (req, res) => {
   const { id } = req.params
   const { isReplied } = req.body

   if (!id || !isReplied) {
      throw new Error("Unable to update inquiry.")
   }

   const update = await prisma.contact.update({
      where: {
         id
      },
      data: {
         isReplied
      }
   })

   if (!update) {
      throw new Error("Unable to update inquiry.")
   }

   res.status(200).json(update)
})