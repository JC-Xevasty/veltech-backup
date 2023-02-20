import { Router } from "express"
import {
   fetchNotifications,
   createNotification
} from "@controllers/notification.controller"

export const notificationRouter: Router = Router()

notificationRouter.get("/user=:userId/fetch", fetchNotifications)
notificationRouter.post("/create", createNotification)

