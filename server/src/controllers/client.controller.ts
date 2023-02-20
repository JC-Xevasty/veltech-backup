import { Request, Response } from "express"
import { config } from "dotenv"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"
import { startCase, camelCase } from "lodash"
import { User_Type } from "@prisma/client"

export const fetchClients = asyncHandler(async (req: Request, res: Response) => {
   const { search } = req.body

   let clients = await prisma.user.findMany({
      where: {
         type: User_Type.CLIENT
      }
   })

   if (!clients) {
      throw new Error("Unable to fetch clients.")
   }

   if (search) clients = clients.filter((client) => {
      const regex = new RegExp(search, "i")
      
      return regex.test(client.companyName as string) || regex.test(`${ startCase(camelCase(client.firstName)) } ${ client.middleName ? (startCase(camelCase(client?.middleName)).charAt(0) + ".") : "" } ${ startCase(camelCase(client.lastName)) }`)
   })

   res.status(200).json(clients)
})

export const fetchClient = asyncHandler(async (req: Request, res: Response) => {
   const { id } = req.params

   const client = await prisma.user.findUnique({
      where: {
         id
      },
      include: {
         quotations: {
            include: {
               project: true
            }
         }
      }
   })

   if (!client) {
      throw new Error("Unable to fetch client.")
   }

   res.status(200).json(client)
})

export const fetchClientQuotations = asyncHandler(async (req: Request, res: Response) => {
   const { id } = req.params   

   const quotations = await prisma.quotation.findMany({
      where: {
         userId: id
      }
   })

   if (!quotations) {
      throw new Error("Unable to fetch client quotations.")
   }

   res.status(200).json(quotations)
})

export const fetchClientProjects = asyncHandler(async (req: Request, res: Response) => {
   const { id } = req.params   

   const projects = await prisma.project.findMany({
      where: {
         userId: id
      }
   })

   if (!projects) {
      throw new Error("Unable to fetch client projects.")
   }

   res.status(200).json(projects)
})