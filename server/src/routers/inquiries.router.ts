import { Router } from "express"
import {
   fetchInquiry,
   fetchInquiries,
   createInquiry,
   updateInquiryIsReplied
} from "@controllers/inquiries.controller"

export const inquiryRouter: Router = Router()

inquiryRouter.get("/id=:id/fetch", fetchInquiry)
inquiryRouter.post("/fetch", fetchInquiries)
inquiryRouter.post("/create", createInquiry)
inquiryRouter.patch("/id=:id/update/is-replied", updateInquiryIsReplied)