import { Request, Response } from "express"
import { config } from "dotenv"
import asyncHandler from "express-async-handler"
import { compare, genSalt, hash } from "bcryptjs"
import { find, map, startCase, camelCase } from "lodash"
import { v4 } from "uuid"
import { User_Type, Activity_Log_Category, Activity_Log_Status } from "@prisma/client"
import { generateToken } from "@functions/tokenGenerator"
import { prisma } from "@config/prisma.config"
import { mailOptions, transport } from "@config/nodemailer.config"

config()

export const fetchUsers = asyncHandler(async (req: Request, res: Response) => {
  const fetchedUsers = await prisma.user.findMany({
    where: {
      // isVerified: true
    },
    select: {
      id: true,
      firstName: true, middleName: true, lastName: true, suffix: true,
      username: true, emailAddress: true,
      isVerified: true, type: true, status: true, createdAt: true
    }
  })

  if (!fetchedUsers) {
    res.status(400)
    throw new Error("Unable to fetch users.")
  }

  res.status(200).json(fetchedUsers)
})

export const fetchAdmins = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.body

  let fetchedAdmins = await prisma.user.findMany({
    where: {
      OR: [
        { type: { equals: User_Type.SUPERADMIN } },
        { type: { equals: User_Type.ADMIN } },
        { type: { equals: User_Type.ACCOUNTING } }
      ]
      // isVerified: true
    },
    select: {
      id: true,
      firstName: true, middleName: true, lastName: true, suffix: true,
      username: true, emailAddress: true,
      isVerified: true, type: true, status: true, createdAt: true
    }
  })

  if (search) fetchedAdmins = fetchedAdmins.filter((admin) => {
    const regex = new RegExp(search, "i")

    return regex.test(`${ startCase(camelCase(admin.firstName)) } ${ admin.middleName ? (startCase(camelCase(admin?.middleName)).charAt(0) + ".") : "" } ${ startCase(camelCase(admin.lastName)) }`) || regex.test(admin.emailAddress) || regex.test(admin.username)
  })

  if (!fetchedAdmins) {
    res.status(400)
    throw new Error("Unable to fetch admins.")
  }

  res.status(200).json(fetchedAdmins)
})

export const fetchClients = asyncHandler(async (req: Request, res: Response) => {
  const fetchedClients = await prisma.user.findMany({
    where: {
      type: User_Type.CLIENT,
      // isVerified: true
    },
    select: {
      id: true,
      firstName: true, middleName: true, lastName: true, suffix: true,
      username: true, emailAddress: true,
      isVerified: true, type: true, status: true, createdAt: true
    }
  })

  if (!fetchedClients) {
    res.status(400)
    throw new Error("Unable to fetch clients.")
  }

  res.status(200).json(fetchedClients)
})

export const fetchUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const fetchedUser = await prisma.user.findFirst({
    where: {
      id,
      // isVerified: true
    },
    select: {
      id: true,
      firstName: true, middleName: true, lastName: true, suffix: true,
      username: true, emailAddress: true, companyName: true,contactNumber: true,
      isVerified: true, type: true, status: true, createdAt: true
    }
  })

  if (!fetchedUser) {
    res.status(400)
    throw new Error("Unable to find or fetch user.")
  }

  res.status(200).json(fetchedUser)
})

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  let {
    firstName, middleName, lastName, suffix, companyName,
    username, emailAddress, contactNumber, password, type, isVerified
  } = req.body

  if (!firstName || !lastName || !username || !emailAddress || !contactNumber || !password || !type) {
    res.status(400)
    throw new Error("Incomplete input.")
  }

  const salt = await genSalt()
  password = await hash(password, salt)

  if (type === 'ADMIN' || type === 'ACCOUNTING') {
    companyName = 'Veltech Industrial Suppression Inc.';
  }

  const createdUser = await prisma.user.create({
    data: {
      firstName, middleName, lastName, suffix, companyName,
      username, emailAddress, contactNumber, password,
      type, verifyToken: v4(), isVerified
    }
  })

  if (!createdUser) {
    res.status(400)
    throw new Error("Unable to create new user.")
  }

  res.status(201).json(createdUser)
})

export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
  let {
    firstName, middleName, lastName, suffix,
    username, emailAddress, contactNumber, type
  } = req.body

  const { id } = req.params

  if (!firstName || !lastName || !username || !emailAddress || !contactNumber || !type || !id) {
    res.status(400)
    throw new Error("Incomplete input.")
  }

  const updatedAdmin = await prisma.user.update({
    where: {
      id
    },
    data: {
      firstName, middleName, lastName, suffix,
      username, emailAddress, contactNumber, type
    }
  })

  if (!updatedAdmin) {
    res.status(400)
    throw new Error("Unable to update user.")
  }

  res.status(201).json(updatedAdmin)
})

export const updateAdminPassword = asyncHandler(async (req: Request, res: Response) => {
  let {
    password
  } = req.body

  const { id } = req.params

  if (!password || !id) {
    res.status(400)
    throw new Error("Incomplete input.")
  }

  const salt = await genSalt()
  password = await hash(password, salt)

  const updatedAdmin = await prisma.user.update({
    where: {
      id
    },
    data: {
      password
    }
  })

  if (!updatedAdmin) {
    res.status(400)
    throw new Error("Unable to update user password.")
  }

  res.status(201).json(updatedAdmin)
})

export const updateAdminStatus = asyncHandler(async (req: Request, res: Response) => {
  let {
    status
  } = req.body

  const { id } = req.params

  if (!status|| !id) {
    res.status(400)
    throw new Error("Incomplete input.")
  }

  const updatedAdmin = await prisma.user.update({
    where: {
      id
    },
    data: {
      status
    }
  })

  if (!updatedAdmin) {
    res.status(400)
    throw new Error("Unable to update user status.")
  }

  res.status(201).json(updatedAdmin)
})

export const verifyAccount = asyncHandler(async (req: Request, res: Response) => {
  const { emailAddress, verifyToken } = req.body

  const verifiedUser = await prisma.user.updateMany({
    where: {
      emailAddress,
      verifyToken
    },
    data: {
      isVerified: true
    }
  })
  
  if (!verifiedUser.count) {
    throw new Error("Unable to verify user.")
  }

  res.status(200).json(!!verifiedUser.count)
})

export const sendVerificationMail = asyncHandler(async (req: Request, res: Response) => {
  const { emailAddress } = req.body

  const user = await prisma.user.findUnique({
    where: {
      emailAddress
    }
  })

  if (!user) {
    throw new Error("Unable to find user.")
  }

  const options = {
    from: "Veltech Inc.",
    to: user.emailAddress,
    subject: "Verify Veltech Account",
    template: "VerifyAccount",
    context: {
      redirect: `${ process.env.CLIENT_BASE_URI }/verify/id=${ user.id }/email-address=${ user.emailAddress }/token=${ user.verifyToken }`
    },
    attachments: [
      {
         filename: "Image-Logo.png",
         path: "./public/assets/Image-Logo.png",
         cid: "Image-Logo"
      }
    ]
  }

  transport.sendMail(options, (err, info) => {
    if (err) {
      throw err
    }
  })

  res.status(200).json(true)
})

export const changeEmailAddress = asyncHandler(async (req: Request, res: Response) => {
  const { formerEmailAddress, newEmailAddress } = req.body

  if (!formerEmailAddress || !newEmailAddress) {
    res.status(400)
    throw new Error("Incomplete input.")
  }

  const updatedUser = await prisma.user.update({
    where: {
      emailAddress: formerEmailAddress
    },
    data: {
      emailAddress: newEmailAddress,
      isVerified: false
    }
  })

  if (!updatedUser) {
    throw new Error("Unable to update e-mail address.")
  }

  res.status(200).json(updatedUser)
})

export const fetchAuthenticated = asyncHandler(async (req: Request, res: Response) => {
  const { uid: id } = req.session

  if (!id) {
    res.status(200).json(null)
    return
  }
  
  const fetchedAuthenticated = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      firstName: true, middleName: true, lastName: true, suffix: true,
      username: true, emailAddress: true, companyName:true, contactNumber:true,
      isVerified: true, type: true, status: true, createdAt: true, image:true
    }
  })

  res.status(200).json(/*id ? fetchedAuthenticated : null*/fetchedAuthenticated)
})

// EditFetchAuthenticated
export const updateCurrent = asyncHandler( async (req: Request, res: Response)=>{
  const { uid: id } = req.session

  let {
    firstName, middleName, lastName, suffix,
    username,image
  } = req.body

  if (!firstName || !lastName || !username) {
    throw new Error("Incomplete or invalid input.")
  }

  const update = await prisma.user.update({
    where: {
      id
    },
    data: {
      firstName, middleName, lastName, suffix,
      username,image
    }
  })

  if (!update) {
    throw new Error("Unable to update profile.")
  }

  res.status(200).json(update)
})

export const authenticateAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { identity, password } = req.body

  if (!identity || !password) {
    throw new Error("Unable to log in admin.")
  }

  const authenticatedAdmin = await prisma.user.findFirst({
    where: {
      AND: [
        {
          OR: [
            { type: { equals: User_Type.SUPERADMIN } },
            { type: { equals: User_Type.ADMIN } }
          ]
        },
        {
          OR: [
            { username: { equals: identity } },
            { emailAddress: { equals: identity } }
          ]
        }
      ],
      // isVerified: true
    }
  })

  if (!authenticatedAdmin) {
    throw new Error("Unable to log in admin.")
  }

  const match = await compare(password, authenticatedAdmin.password)

  if (!match) {
    throw new Error("Unable to log in admin.")
  }

  const sessions = await prisma.session.findMany()

  if (!sessions) {
    throw new Error("Unable to log in admin.")
  }

  const inSession = find(map(sessions, ({ data }) => JSON.parse(data).uid), (id) => id === authenticatedAdmin.id)

  if (inSession) {
    throw new Error("Already logged in.")
  }

  req.session.uid = authenticatedAdmin.id
  res.status(200).json(authenticatedAdmin)
})

export const authenticateAccounting = asyncHandler(async (req: Request, res: Response) => {
  const { identity, password } = req.body

  if (!identity || !password) {
    throw new Error("Unable to log in admin.")
  }

  const authenticatedAdmin = await prisma.user.findFirst({
    where: {
      AND: [
        {
          type: User_Type.ACCOUNTING
        },
        {
          OR: [
            { username: { equals: identity } },
            { emailAddress: { equals: identity } }
          ]
        }
      ],
      // isVerified: true
    }
  })

  if (!authenticatedAdmin) {
    throw new Error("Unable to log in admin.")
  }

  const match = await compare(password, authenticatedAdmin.password)

  if (!match) {
    throw new Error("Unable to log in admin.")
  }

  const sessions = await prisma.session.findMany()

  if (!sessions) {
    throw new Error("Unable to log in admin.")
  }

  const inSession = find(map(sessions, ({ data }) => JSON.parse(data).uid), (id) => id === authenticatedAdmin.id)

  if (inSession) {
    throw new Error("Already logged in.")
  }

  req.session.uid = authenticatedAdmin.id
  res.status(200).json(authenticatedAdmin)
})

export const authenticateClient = asyncHandler(async (req: Request, res: Response) => {
  const { identity, password } = req.body

  if (!identity || !password) {
    throw new Error("Unable to log in user.")
  }

  const authenticatedClient = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: identity } },
        { emailAddress: { equals: identity } }
      ],
      // isVerified: true
    }
  })

  if (!authenticatedClient) {
    throw new Error("Unable to log in user.")
  }

  const match = await compare(password, authenticatedClient.password)

  if (!match) {
    throw new Error("Unable to log in user.")
  }

  const sessions = await prisma.session.findMany()

  if (!sessions) {
    throw new Error("Unable to log in user.")
  }

  const inSession = find(map(sessions, ({ data }) => JSON.parse(data).uid), (id) => id === authenticatedClient.id)

  if (inSession) {
    throw new Error("Already logged in.")
  }

  req.session.uid = authenticatedClient.id
  res.status(200).json(authenticatedClient)
})

export const deauthenticateUser = asyncHandler(async (req: Request, res: Response) => {
  const deauthenticatedUser = await req.session.destroy(() => {})
  
  if (!deauthenticatedUser.uid) {
    throw new Error("Unable to log out user.")
  }

  res.clearCookie("connect.sid")
  res.status(200).json(deauthenticatedUser.uid)
})

export const checkUsernameExists = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.body

  const checkUsernameCount = await prisma.user.count({
    where: {
      username,
      // isVerified: true
    }
  })

  res.status(200).json({ exists: checkUsernameCount >= 1 })
})

export const checkEmailAddressExists = asyncHandler(async (req: Request, res: Response) => {
  const { emailAddress } = req.body

  const checkEmailAddressCount = await prisma.user.count({
    where: {
      emailAddress,
      // isVerified: true
    }
  })

  res.status(200).json({ exists: checkEmailAddressCount >= 1 })
})

export const checkContactNumberExists = asyncHandler(async (req: Request, res: Response) => {
  const { contactNumber } = req.body

  const checkContactNumberCount = await prisma.user.count({
    where: {
      contactNumber,
      // isVerified: true
    }
  })

  res.status(200).json({ exists: checkContactNumberCount >= 1 })
})

// Reset Password
export const sendResetCode = asyncHandler(async (req: Request, res: Response) => {
  const { emailAddress } = req.body

  if (!emailAddress) {
    throw new Error("Incomplete or invalid input.")
  }

  const resetToken = generateToken(6, {
    hasUpper: true,
    hasNumber: true
  })

  const update = await prisma.user.updateMany({
    where: {
      emailAddress,
      isVerified: true
    },
    data: {
      resetToken
    }
  })

  if (!update.count) {
    throw new Error("Unable to update user token.")
  }

  const updatedUser = await prisma.user.findFirst({
    where: {
      emailAddress
    }
  })

  if (!updatedUser) {
    throw new Error("Unable to find or update user token.")
  }

  const options = {
    from: "Veltech Inc.",
    to: updatedUser.emailAddress,
    subject: "Veltech Account Password Reset Code",
    template: "ResetCode",
    context: {
      resetCode: updatedUser.resetToken
    },
    attachments: [
      {
         filename: "Image-Logo.png",
         path: "./public/assets/Image-Logo.png",
         cid: "Image-Logo"
      }
    ]
  }

  transport.sendMail(options, (err, info) => {
    if (err) {
      res.status(400)
      throw err
    }
  })

  res.status(200).json(!!update.count)
})

export const fetchResetCode = asyncHandler(async (req: Request, res: Response) => {
  const { emailAddress } = req.params

  if (!emailAddress) {
    throw new Error("Incomplete or invalid input.")
  }

  const fetchedToken = await prisma.user.findFirst({
    where: {
      emailAddress,
      isVerified: true
    },
    select: {
      id: true,
      emailAddress: true,
      resetToken: true
    }
  })

  if (!fetchedToken) {
    throw new Error("Unable to find user.")
  }

  res.status(200).json(fetchedToken)
})

export const nullifyResetCode = asyncHandler(async (req: Request, res: Response) => {
  const { emailAddress, resetToken } = req.body

  console.log(emailAddress, resetToken)

  if (!emailAddress || !resetToken) {
    throw new Error("Incomplete or invalid input.")
  }

  const update = await prisma.user.updateMany({
    where: {
      emailAddress,
      isVerified: true,
      resetToken
    },
    data: {
      resetToken: null
    }
  })

  if (!update.count) {
    throw new Error("Unable to nullify user token.")
  }

  res.status(200).json(!!update.count)
})

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  let { emailAddress, resetToken, password } = req.body

  if (!emailAddress || !resetToken || !password) {
    throw new Error("Incomplete or invalid input.")
  }

  const salt = await genSalt()
  password = await hash(password, salt)

  const update = await prisma.user.updateMany({
    where: {
      emailAddress,
      resetToken,
      isVerified: true
    },
    data: {
      password,
      resetToken: null
    }
  })

  if (!update.count) {
    throw new Error("Unable to update password.")
  }

  res.status(200).json(!!update.count)
})

const getUserType = (type: string) => Object.entries(User_Type).filter(([_, value]) => type === value)[0]

export const changeProfilePassword = asyncHandler(async (req, res) => {
  let { username, password } = req.body

  if (!username || !password) {
    throw new Error("Incomplete or invalid input.")
  }

  password = await hash(password, await genSalt())

  const update = await prisma.user.update({
    where: {
      username
    },
    data: {
      password
    }
  })

  if (!update) {
    throw new Error("Failed to update user.")
  }

  res.status(200).json(update)
})

export const checkPasswordMatch = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  const fetch = await prisma.user.findUnique({
    where: {
      username
    }
  })

  if (!fetch) {
    res.status(200).json({ match: false })
    return
  }

  const match = await compare(password, fetch.password)

  res.status(200).json({ match })
})