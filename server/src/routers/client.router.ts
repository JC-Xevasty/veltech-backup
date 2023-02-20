import { Router } from "express"
import {
   fetchClients,
   fetchClient,
   fetchClientQuotations,
   fetchClientProjects
} from "@controllers/client.controller"

export const clientRouter: Router = Router()

clientRouter.post("/fetch", fetchClients)
clientRouter.get("/id=:id/fetch", fetchClient)
clientRouter.get("/id=:id/fetch/quotations", fetchClientQuotations)
clientRouter.get("/id=:id/fetch/projects", fetchClientProjects)