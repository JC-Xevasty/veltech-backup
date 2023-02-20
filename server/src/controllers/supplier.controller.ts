import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"

export const fetchSuppliers = asyncHandler(async (req: Request, res: Response) => {
   let fetch = await prisma.supplier.findMany({
      include: {
         contacts: true,
         address: true
      }
   })

   if (!fetch) {
      throw new Error("Unable to fetch suppliers.")
   }

   const { search } = req.body

   if (search) {
      fetch = fetch.filter((supplier) => new RegExp(search, "i").test(supplier.name))
   }

   res.status(200).json(fetch)
})

export const fetchSupplier = asyncHandler(async (req: Request, res: Response) => {
   const { id } = req.params

   const fetch = await prisma.supplier.findUnique({
      where: {
         id
      },
      include: {
         address: true,
         contacts: true
      }
   })

   if (!fetch) {
      throw new Error("Unable to find or fetch supplier.")
   }

   res.status(200).json(fetch)   
})

export const createSupplier = asyncHandler(async (req: Request, res: Response) => {
   const {
      name, phone, landline,
      contact1: { firstName1, lastName1, emailAddress1, contactNumber1 },
      contact2: { firstName2, lastName2, emailAddress2, contactNumber2 },
      address: { street, suite, city, province, zipCode },
      note
   } = req.body

   if (
      !name || !phone || !landline ||
      !firstName1 || !lastName1 || !emailAddress1 || !contactNumber1 ||
      !street || !suite || !city || !province || !zipCode || !note
   ) {
      throw new Error("Incomplete or invalid input.")
   }

   let contacts = [
      { firstName: firstName1, lastName: lastName1, emailAddress: emailAddress1, phone: contactNumber1 }
   ]

   if (firstName2 && lastName2 && emailAddress2 && contactNumber2) {
      contacts = [...contacts, { firstName: firstName2, lastName: lastName2, emailAddress: emailAddress2, phone: contactNumber2 }]
   } 

   const create = await prisma.supplier.create({
      data: {
         name, phone, landline,
         contacts: {
            createMany: {
               data: contacts
            }
         },
         address: {
            create: {
               street, suite, city, province, zipCode
            }
         },
         note
      },
      include: {
         address: true,
         contacts: true
      }
   })

   if (!create) {
      throw new Error("Unable to create new supplier.")
   }

   res.status(201).json(create)
})

export const updateSupplier = asyncHandler(async (req: Request, res: Response) => {
   const {
      name, phone, landline,
      contact1: { firstName1, lastName1, emailAddress1, contactNumber1 },
      contact2: { firstName2, lastName2, emailAddress2, contactNumber2 },
      address: { street, suite, city, province, zipCode },
      note
   } = req.body

   const { id } = req.params

   if (
      !name || !phone || !landline ||
      !firstName1 || !lastName1 || !emailAddress1 || !contactNumber1 ||
      !street || !suite || !city || !province || !zipCode || !note
   ) {
      throw new Error("Incomplete or invalid input.")
   }

   const fetch = await prisma.supplier.findUnique({
      where: {
         id
      },
      include: {
         contacts: true
      }
   })

   let contacts = [
      { firstName: firstName1, lastName: lastName1, emailAddress: emailAddress1, phone: contactNumber1 }
   ]

   if (firstName2 && lastName2 && emailAddress2 && contactNumber2) {
      contacts = [...contacts, { firstName: firstName2, lastName: lastName2, emailAddress: emailAddress2, phone: contactNumber2 }]
   } 

   const update = await prisma.supplier.update({
      where: {
         id
      },
      data: {
         name, phone, landline,
         contacts: {
            deleteMany: {
               supplierId: fetch!.id
            },
            createMany: {
               data: contacts
            }
         },
         address: {
            create: {
               street, suite, city, province, zipCode
            }
         },
         note
      },
      include: {
         address: true,
         contacts: true
      }
   })

   if (!update) {
      throw new Error("Unable to find or update supplier.")
   }

   res.status(200).json(update)
})

export const checkNameExists = asyncHandler(async (req: Request, res: Response) => {
   const { name } = req.body

   const checkNameCount = await prisma.supplier.count({
      where: {
         name
      }
   })

   res.status(200).json({ exists: checkNameCount >= 1 })
})

export const checkCompanyPhoneNumberExists = asyncHandler(async (req: Request, res: Response) => {
   const { phone } = req.body

   const checkCompanyPhoneNumberCount = await prisma.supplier.count({
      where: {
         phone
      }
   })

   res.status(200).json({ exists: checkCompanyPhoneNumberCount >= 1 })
})

export const checkCompanyLandlineExists = asyncHandler(async (req: Request, res: Response) => {
   const { landline } = req.body

   const checkCompanyLandlineCount = await prisma.supplier.count({
      where: {
         landline
      }
   })

   res.status(200).json({ exists: checkCompanyLandlineCount >= 1 })
})

export const checkEmailAddressExists = asyncHandler(async (req: Request, res: Response) => {
   const { emailAddress } = req.body

   const checkEmailAddressCount = await prisma.supplier_Contact.count({
      where: {
         emailAddress
      }
   })

   res.status(200).json({ exists: checkEmailAddressCount >= 1 })
})

export const checkPhoneNumberExists = asyncHandler(async (req: Request, res: Response) => {
   const { phone } = req.body

   const checkPhoneNumberCount = await prisma.supplier_Contact.count({
      where: {
         phone
      }
   })

   res.status(200).json({ exists: checkPhoneNumberCount >= 1 })
})