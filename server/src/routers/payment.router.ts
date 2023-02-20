import { Router } from "express";
import multer from "multer";
import fs = require('fs');
import {
    acceptPayment,
    fetchPayments,
    rejectPayment,
    checkProjectExists,
    createPayment,
    fetchClientPayments,
    updateBalance,
} from "@controllers/payment.controller";

export const paymentRouter: Router = Router();

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

paymentRouter.post("/upload", upload.single('file'), (req, res) => {
    if (!req.file?.filename) {
      throw new Error("There is no file uploaded.")
    }
  
    const uploadedFile = {
      field: req.file?.fieldname,
      originalName: req.file?.originalname,
      fileName: req.file?.filename,
      path: req.file?.path
    }
    
    res.status(201).json(uploadedFile)
  })

paymentRouter.post("/fetch/", fetchPayments);
paymentRouter.get("/uid=:uid/fetch",fetchClientPayments)
paymentRouter.patch("/accept/", acceptPayment);
paymentRouter.patch("/update-balance/", updateBalance);
paymentRouter.patch("/reject/", rejectPayment);
paymentRouter.post("/exists/project", checkProjectExists)
paymentRouter.post("/create", createPayment)