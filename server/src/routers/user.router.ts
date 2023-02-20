import { Router } from "express"
import multer from "multer"
import {
  fetchUser,
  fetchUsers,
  fetchClients,
  fetchAdmins,
  createUser,
  updateAdmin,
  updateAdminPassword,
  updateAdminStatus,
  fetchAuthenticated,
  updateCurrent,
  authenticateClient,
  authenticateAdmin,
  authenticateAccounting,
  deauthenticateUser,
  checkUsernameExists,
  checkEmailAddressExists,
  checkContactNumberExists,

  verifyAccount,
  sendVerificationMail,
  changeEmailAddress,

  sendResetCode,
  nullifyResetCode,
  fetchResetCode,
  changePassword,

  checkPasswordMatch,
  changeProfilePassword
} from "@controllers/user.controller"

export const userRouter: Router = Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`)
  }
})

const upload = multer({
  storage: storage
})

userRouter.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file?.filename) {
    throw new Error("There is no photo uploaded")
  }
  const uploadedImage = {
    field: req.file?.fieldname,
    originalName: req.file?.originalname,
    fileName: req.file?.filename,
    path: req.file?.path,
  }

  res.status(201).json(uploadedImage)
})

userRouter.get("/id=:id/fetch", fetchUser)
userRouter.get("/fetch", fetchUsers)
userRouter.get("/fetch/client", fetchClients)
userRouter.post("/fetch/admin", fetchAdmins)
userRouter.post("/create", createUser)
userRouter.patch("/id=:id/update", updateAdmin)
userRouter.patch("/id=:id/update/password", updateAdminPassword)
userRouter.patch("/id=:id/update/status", updateAdminStatus)
userRouter.get("/authenticated/fetch", fetchAuthenticated)
userRouter.patch("/update/current", updateCurrent)
userRouter.post("/authenticate/client", authenticateClient)
userRouter.post("/authenticate/admin", authenticateAdmin)
userRouter.post("/authenticate/accounting", authenticateAccounting)
userRouter.delete("/deauthenticate", deauthenticateUser)
userRouter.post("/exists/username", checkUsernameExists)
userRouter.post("/exists/emailAddress", checkEmailAddressExists)
userRouter.post("/exists/contactNumber", checkContactNumberExists)

userRouter.post("/verify", verifyAccount)
userRouter.post("/verify/send", sendVerificationMail)
userRouter.post("/verify/email-address/change", changeEmailAddress)

userRouter.get("/reset/code/emailAddress=:emailAddress/fetch", fetchResetCode)
userRouter.patch("/reset/nullify", nullifyResetCode)
userRouter.patch("/reset/send", sendResetCode)
userRouter.patch("/reset/password/change", changePassword)

userRouter.post("/check/password/match", checkPasswordMatch)
userRouter.patch("/update/profile/password", changeProfilePassword)