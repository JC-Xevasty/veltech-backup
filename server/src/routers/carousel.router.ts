import { Router } from "express"
import multer from "multer"
import fs from "fs"

import {
   createEntry,
   fetchEntries,
   fetchEntry,
   updateEntry,
   updateEntryStatus
} from "@controllers/carousel.controller"

export const carouselRouter: Router = Router()

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
 
 carouselRouter.post("/upload", upload.single("image"), (req, res) => {
   if (!req.file?.filename) {
      throw new Error("There is no file uploaded.")
   }
 
   const imgPath = {
     field: req.file?.fieldname,
     originalName: req.file?.originalname,
     fileName: req.file?.filename,
     path: req.file?.path
   }
   
   res.status(201).json(imgPath)
 })

carouselRouter.post("/create", createEntry)
carouselRouter.get("/fetch", fetchEntries)
carouselRouter.get("/id=:id/fetch", fetchEntry)
carouselRouter.patch("/id=:id/update", updateEntry)
carouselRouter.patch("/id=:id/update/status", updateEntryStatus)

