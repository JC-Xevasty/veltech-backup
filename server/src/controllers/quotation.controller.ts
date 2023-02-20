import { Request, Response } from "express"
import { config } from "dotenv"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"

config();

export const fetchQuotations = asyncHandler(async (req: Request, res: Response) => {
    const fetchedQuotations = await prisma.quotation.findMany({
        where: {},
        include: {
            user: {
                select: { companyName: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    // 1
    if (!fetchedQuotations) {
        res.status(400)
        throw new Error("Unable to fetch quotations");
    }


    res.status(200).json(fetchedQuotations);
});

export const fetchQuotation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const fetchedQuotation = await prisma.quotation.findFirst({
        where: { id },
        include: {
            user: {
                select: {
                    firstName: true, middleName: true,
                    lastName: true, suffix: true, emailAddress: true,
                    companyName: true, contactNumber: true,
                }
            },
        }
    });

    if (!fetchedQuotation) {
        res.status(400)
        throw new Error("Unable to fetch quotation");
    }

    res.status(200).json(fetchedQuotation);
});

export const fetchClientQuotations = asyncHandler(async (req: Request, res: Response) => {
    const { uid } = req.params;

    const fetchedClientQuotations = await prisma.quotation.findMany({
        where: { userId: uid },
        orderBy: { createdAt: 'desc' }
    });

    if (!fetchedClientQuotations) {
        res.status(400);
        throw new Error("Unable to fetch client quotations");
    }

    res.status(200).json(fetchedClientQuotations);
});

export const fetchClientQuotation = asyncHandler(async (req: Request, res: Response) => {
    const { id, uid } = req.params;

    const fetchedClientQuotation = await prisma.quotation.findFirst({
        where: { id, userId: uid },
        include: {
            user: {
                select: {
                    firstName: true, middleName: true,
                    lastName: true, suffix: true, emailAddress: true,
                    companyName: true, contactNumber: true
                }
            }
        }

    });

    if (!fetchedClientQuotation) {
        res.status(400);
        throw new Error("Unable to fetch client quotation");
    }

    res.status(200).json(fetchedClientQuotation);
});

export const fetchQuotationsByQuery = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body;

    const fetchedQuotationsByQuery = await prisma.quotation.findMany({
        where: {
            ...((query != null && query != "") && {
                user: {
                    companyName: {
                        contains: query,
                        mode: "insensitive"
                    }
                }
            })
        },
        include: {
            user: {
                select: {
                    firstName: true, middleName: true,
                    lastName: true, suffix: true, emailAddress: true,
                    companyName: true, contactNumber: true, type: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }

    })

    if (!fetchedQuotationsByQuery) {
        res.status(400);
        throw new Error("Unable to fetch quotations based on query");
    }

    res.status(200).json(fetchedQuotationsByQuery);
})

export const setQuotationStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id, quotationStatus } = req.body;
    try {
        const updatedQuotation = await prisma.quotation.update({
            where: { id },
            data: { quotationStatus }
        })

        res.status(200).json(updatedQuotation);
    } catch (error) {
        res.status(400)
        throw new Error("Unable to set quotation status");
    }

});

export const setProjectCost = asyncHandler(async (req: Request, res: Response) => {
    const { id, quotationStatus, materialsCost, laborCost, requirementsCost, quotation } = req.body;

    try {
        const updatedQuotation = await prisma.quotation.update({
            where: { id },
            data: {
                quotationStatus, materialsCost, laborCost,
                requirementsCost, quotation
            }
        })

        res.status(200).json(updatedQuotation);
    } catch (error) {
        res.status(400)
        throw new Error("Unable to update quotation");
    }
});

export const createQuotation = asyncHandler(async (req: Request, res: Response) => {
    let {
        userId,
        projectType,
        buildingType,
        establishmentSizeWidth,
        establishmentSizeHeight,
        projectFeatures,
        floorPlan,
    } = req.body;

    if (!userId) {
        res.status(400);
        throw new Error("Must be logged in.");
    }

    console.log(req.body)

    if (!projectType || !buildingType || !establishmentSizeWidth || !establishmentSizeHeight || !floorPlan) {
        res.status(400)
        throw new Error("Incomplete input.")
    }

    const fetchedUser = await prisma.user.findFirst({ where: { id: userId } });

    if (!fetchedUser) {
        res.status(400);
        throw new Error("Unable to request quotation");
    }

    const createdQuotation = await prisma.quotation.create({
        data: {
            projectType, buildingType, establishmentSizeWidth, establishmentSizeHeight, projectFeatures,
            floorPlan, userId
        }
    })

    if (!createdQuotation) {
        res.status(400);
        throw new Error("Unable to request quotation");
    }

    res.status(201).json(createdQuotation);
})

export const deleteQuotation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedQuotation = await prisma.quotation.delete({
        where: { id }
    });

    if (!deletedQuotation) {
        res.status(400)
        throw new Error("Unable to delete quotation");
    }

    res.status(201).json(deletedQuotation);
});