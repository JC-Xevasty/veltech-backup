import { Router } from "express"

import {
   fetchSuppliers,
   fetchSupplier,
   createSupplier,
   updateSupplier,
   checkNameExists,
   checkCompanyPhoneNumberExists,
   checkCompanyLandlineExists,
   checkEmailAddressExists,
   checkPhoneNumberExists
} from "@controllers/supplier.controller"

export const supplierRouter: Router = Router()

supplierRouter.post("/fetch", fetchSuppliers)
supplierRouter.get("/id=:id/fetch", fetchSupplier)
supplierRouter.post("/create", createSupplier)
supplierRouter.post("/id=:id/update", updateSupplier)
supplierRouter.post("/exists/name", checkNameExists)
supplierRouter.post("/exists/company/phone", checkCompanyPhoneNumberExists)
supplierRouter.post("/exists/company/landline", checkCompanyLandlineExists)
supplierRouter.post("/exists/contact/email-address", checkEmailAddressExists)
supplierRouter.post("/exists/contact/phone", checkPhoneNumberExists)

