import { Router } from "express"

import {
  resetSessions
} from "@controllers/session.controller"

export const sessionRouter: Router = Router()

sessionRouter.delete("/reset", resetSessions)