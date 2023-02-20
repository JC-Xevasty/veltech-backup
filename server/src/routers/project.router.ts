import { Router } from "express"
import multer from "multer";
import fs = require('fs');
import {
    fetchProject,
    fetchProjects,
    fetchClientProject,
    fetchClientProjects,
    createProject,
    fetchProjectsByQuery,
    setProjectStatus,
    setPaymentStatus,
    updateContract,
    createMilestone,
    editMilestone,
    fetchMilestones,
    updateSignedContract,
    updateMilestoneBillingStatus,
    updateMilestoneStatus
} from "@controllers/project.controller";

export const projectRouter: Router = Router();

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

projectRouter.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file?.filename) {
      throw new Error("There is no photo uploaded")
    }
    const uploadedFile = {
      field: req.file?.fieldname,
      originalName: req.file?.originalname,
      fileName: req.file?.filename,
      path: req.file?.path,
    }
  
    res.status(201).json(uploadedFile)
  })


projectRouter.get("/id=:id/fetch", fetchProject);
projectRouter.get("/fetch", fetchProjects);

projectRouter.get("/uid=:uid/fetch", fetchClientProjects);
projectRouter.get("/uid=:uid/id=:id/fetch", fetchClientProject);

projectRouter.get("/projectId=:projectId/fetch",fetchMilestones)

projectRouter.post("/create",createProject);
projectRouter.post("/fetch/query", fetchProjectsByQuery);

projectRouter.patch("/update-project-status",setProjectStatus);
projectRouter.patch("/update-payment-status",setPaymentStatus);
projectRouter.patch("/update-contract/id=:id",updateContract);
projectRouter.patch("/update-signed-contract/id=:id", updateSignedContract)
projectRouter.patch("/update/milestone=:milestoneNo/project=:projectId", editMilestone)
projectRouter.patch("/update/milestone=:milestoneNo/project=:projectId/status", updateMilestoneStatus)
projectRouter.patch("/update/milestone=:milestoneNo/project=:projectId/billing/status", updateMilestoneBillingStatus)

projectRouter.post("/create-milestone",createMilestone)