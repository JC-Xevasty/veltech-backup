import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"

export const fetchActivities = asyncHandler(async (req, res) => {
    let fetch = await prisma.activity_Log.findMany({
        orderBy: {
            loggedAt: "desc"
        }
    })

    if (!fetch) {
        throw new Error("Unable to fetch activities")
    }

    const { userRole, category } = req.body

    if (userRole) fetch = fetch.filter(activity => new RegExp(userRole, "i").test(activity.userRole))
    if (category) fetch = fetch.filter(activity => new RegExp(category, "i").test(activity.category))

    res.status(200).json(fetch)
})

export const createActivity = asyncHandler(async (req: Request, res: Response) => {
    let {
        userRole,
        entry,
        module,
        category,
        status
    } = req.body

    const createdActivity = await prisma.activity_Log.create({
        data: { userRole, entry, module, category, status }
    })

    if (!createdActivity) {
        throw new Error("Unable to request activity")
    }

    res.status(201).json(createdActivity)
})