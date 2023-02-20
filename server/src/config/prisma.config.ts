import { Store } from "express-session"
import { PrismaClient } from "@prisma/client"
import { PrismaSessionStore } from "@quixo3/prisma-session-store"

export const prisma: PrismaClient = new PrismaClient()

export const store: Store = new PrismaSessionStore(prisma, {
  checkPeriod: 5 * 60 * 1000, // 5 Minutes
  ttl: 24 * 60 * 60 * 1000, // 1 Day
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined
})