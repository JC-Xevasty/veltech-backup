import { genSalt, hash } from "bcryptjs"
import { v4 } from "uuid"
import { prisma } from "./src/config/prisma.config"
import { User_Type } from "@prisma/client"

const seed = async () => {
  const application = await prisma.application.findFirst()
  
  if (!application) {
    await prisma.application.create({
      data: {
        appName: "Veltech Inc.",
        companyName: "Veltech Industrial Supression Inc.",
        companyAddress: "Metro Manila",
        companyContactNumber: "09123456789",
        companyEmailAddress: "veltech_inc@gmail.com"
      }
    })
  }
  
  const salt = await genSalt()

  await prisma.user.upsert({
    where: {
      username: "superadmin"
    },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      username: "superadmin",
      emailAddress: "n/a",
      contactNumber: "n/a",
      companyName: "Veltech Inc.",
      password: await hash("superadmin", salt),
      type: User_Type.SUPERADMIN,
      isVerified: true,
      verifyToken: v4()
    }
  })

  for (let i = 0; i < 8; i++) {
    console.log(i)
    await prisma.user.upsert({
      where: {
        username: `admin${ i + 1 }`
      },
      update: {},
      create: {
        firstName: `Admin${ i + 1 }`,
        lastName: `Admin${ i + 1 }`,
        username: `admin${ i + 1 }`,
        emailAddress: `admin${ i + 1 }@email.com`,
        contactNumber: `0992${ i + 1 }${ i + 1 }${ i + 1 }${ i + 1 }${ i + 1 }${ i + 1 }${ i + 1 }`,
        companyName: "Veltech Inc.",
        password: await hash(`admin${ i + 1 }`, salt),
        type: User_Type.ADMIN,
        isVerified: true,
        verifyToken: v4()
      }
    })

    await prisma.user.upsert({
      where: {
        username: `accounting${ i + 1 }`
      },
      update: {},
      create: {
        firstName: `Accounting${ i + 1 }`,
        lastName: `Accounting${ i + 1 }`,
        username: `accounting${ i + 1 }`,
        emailAddress: `accounting${ i + 1 }@email.com`,
        contactNumber: `0995${ i + 1 }${ i + 1 }${ i + 1 }${ i + 1 }${ i + 1 }${ i + 1 }${ i + 1 }`,
        password: await hash(`accounting${ i + 1 }`, salt),
        type: User_Type.ACCOUNTING,
        isVerified: true,
        verifyToken: v4()
      }
    })
  }
}

seed()