import { Router } from "express"
import multer from "multer"
import fs from "fs"

import {
   fetchApplication,
   resetApplication,
   updateApplication
} from "@controllers/application.controller"

export const applicationRouter: Router = Router()

applicationRouter.get("/fetch", fetchApplication)
applicationRouter.post("/id=:id/reset", resetApplication)
applicationRouter.put("/id=:id/update", updateApplication)

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, "public/app")
   },
   filename: (req, file, cb) => {
     cb(null, `${ Date.now() }--${ file.originalname }`)
   }
})

applicationRouter.post("/upload/images", multer({ storage }).fields([
   { name: "logo" }, { name: "favicon" }, { name: "header" }
]), 
   (req, res) => res.json(req.files)
)