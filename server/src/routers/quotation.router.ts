import { Router } from "express";
import multer from "multer";
import fs = require('fs');
import {
  fetchQuotations,
  fetchQuotation,
  fetchClientQuotations,
  fetchClientQuotation,
  createQuotation,
  deleteQuotation,
  fetchQuotationsByQuery,
  setQuotationStatus,
  setProjectCost
} from "@controllers/quotation.controller";

export const quotationRouter: Router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const { prevQuotationFile } = req.body;
    if (prevQuotationFile) {
      let files = fs.readdirSync('public/uploads');
      if (files.includes(prevQuotationFile)) {
        fs.unlinkSync(`public/uploads/${prevQuotationFile}`);
      }
    }
    cb(null, true);
  }
})

quotationRouter.get("/file/:file/fetch", (req, res) => {
  const {file} = req.params;

  let files = fs.readdirSync('public/uploads');

  if (files.includes(file)) {
    res.status(200).sendFile(`public/uploads/${file}`, {root: "./"});
  } else {
    res.status(404)
    throw new Error("File does not exist")
  }
})

quotationRouter.post("/upload", upload.single('file'), (req, res) => {
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

quotationRouter.get("/fetch", fetchQuotations);
quotationRouter.get("/id=:id/fetch", fetchQuotation);
quotationRouter.post("/fetch/query", fetchQuotationsByQuery);
quotationRouter.get("/uid=:uid/fetch", fetchClientQuotations);
quotationRouter.get("/uid=:uid/id=:id/fetch", fetchClientQuotation);
quotationRouter.patch("/update-status", setQuotationStatus);
quotationRouter.patch("/set-cost", setProjectCost);
quotationRouter.post("/create", createQuotation);
quotationRouter.delete("/id=:id", deleteQuotation);