import { Router } from "express";
import {
    fetchActivities,
    createActivity,
} from "@controllers/activityLog.controller";

export const activityLogsRouter: Router = Router();

activityLogsRouter.post("/fetch", fetchActivities);
activityLogsRouter.post("/create", createActivity);