import { Request, Response } from "express"
import { config } from "dotenv"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"

config();

export const fetchPayments = asyncHandler(async (req: Request, res: Response) => {
    const { query, paymentStatus } = req.body;

    const fetchedPayments = await prisma.proof_Of_Payment.findMany({
        where: {
            AND: [
                {
                    ...((query != null && query != "") && {
                        user: {
                            OR: [
                                { firstName: { contains: query, mode: "insensitive" } },
                                { lastName: { contains: query, mode: "insensitive" } }
                            ]
                        },
                    })
                },
                { ...((paymentStatus != null && paymentStatus != "") && { paymentStatus }) }
            ]
        },

        include: {
            user: {
                select: {
                    firstName: true, middleName: true,
                    lastName: true, suffix: true, emailAddress: true,
                    companyName: true, contactNumber: true, type: true
                }
            },
            project: {
                select: { remainingBalance: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    if (!fetchedPayments) {
        res.status(400);
        throw new Error("Unable to fetch quotations based on query");
    }

    res.status(200).json(fetchedPayments);
})

export const fetchClientPayments = asyncHandler(async (req: Request, res: Response) => {
    const { uid } = req.params

    const fetchedPayments = await prisma.proof_Of_Payment.findMany({
        where: { userId: uid },
    })

    if (!fetchedPayments) {
        res.status(400)
        throw new Error("Unable to fetch payments.")
    }

    res.status(200).json(fetchedPayments)
})

export const acceptPayment = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, userId } = req.body;
    const { id } = req.body;

    try {
        const updatedPayment = await prisma.proof_Of_Payment.update({
            where: { id },
            data: { paymentStatus: "ACCEPTED" }
        })

        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(400)
        throw new Error("Unable to accept payment");
    }
});

export const updateBalance = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, remainingBalance, amount, category, milestoneNo } = req.body;

    try {
        let newBalance = remainingBalance - parseFloat(amount);

        if (category === 'DOWNPAYMENT') {
            const updatedBalance = await prisma.project.update({
                where: { id: projectId },
                data: { remainingBalance: newBalance, paymentStatus: 'WAITING_PAYMENT' }
            })

            res.status(200).json(updatedBalance);
        } else if (category === 'MILESTONE') {
            const updatedBalance = await prisma.project.update({
                where: { id: projectId },
                data: { remainingBalance: newBalance, paymentStatus: newBalance <= 0 ? 'FULLY_PAID' : 'WAITING_PAYMENT' }
            })

            const updatedMilestone = await prisma.project_Milestone.update({
                where: { milestoneNo_projectId: { milestoneNo, projectId } },
                data: {
                    paymentStatus: 'FULLY_PAID',
                    billingStatus: 'PAID',
                }
            })

            res.status(200).json(updatedBalance);
        }


    } catch (error) {
        res.status(400)
        throw new Error("Unable to update project balance.");
    }
});

export const rejectPayment = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, userId } = req.body;
    const { id } = req.body;

    try {
        const updatedPayment = await prisma.proof_Of_Payment.update({
            where: { id },
            data: { paymentStatus: "REJECTED" }
        })

        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(400)
        throw new Error("Unable to reject payment");
    }
});


export const checkProjectExists = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body

    const checkProjectCount = await prisma.project.count({
        where: {
            id,
            // OR: [
            //     { paymentStatus: "WAITING_PAYMENT" },
            //     { paymentStatus: "WAITING_DOWNPAYMENT" },
            // ]
        }
    })

    const exists = checkProjectCount >= 1;

    if (exists) {
        const project = await prisma.project.findFirst({
            where: { id },
            select: { projectStatus: true, paymentStatus: true, projectMilestones: true }
        });

        const fullyPaid = project?.paymentStatus === 'FULLY_PAID';

        res.status(200).json({
            exists: checkProjectCount >= 1,
            fullyPaid: fullyPaid,
            projectStatus: project?.projectStatus,
            paymentStatus: project?.paymentStatus,
            milestone: project?.projectMilestones.length,
            milestones: project?.projectMilestones
        })
    } else {
        res.status(200).json({ exists: checkProjectCount >= 1, projectStatus: "" });
    }
})

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, userId, imageFileName, referenceNo, amount, category, milestoneNo, dateOfPayment } = req.body;

    if (!userId) {
        res.status(400);
        throw new Error("Must be logged in.");
    }

    if (!projectId || !imageFileName || !referenceNo || !amount || !category || !dateOfPayment) {
        res.status(400)
        throw new Error("Incomplete input.")
    }

    const fetchedUser = await prisma.user.findFirst({ where: { id: userId } });

    if (!fetchedUser) {
        res.status(400);
        throw new Error("Unable to create payment.");
    }

    const fetchedProject = await prisma.project.findFirst({ where: { id: projectId } });

    if (!fetchedProject) {
        res.status(400);
        throw new Error("Unable to create payment.");
    }

    const createdPayments = await prisma.proof_Of_Payment.create({
        data: {
            projectId, userId, imageFileName, referenceNo,
            amount, category, dateOfPayment,
            milestoneNo: category === 'MILESTONE' ? milestoneNo : null,
            currentBalance: +fetchedProject.remainingBalance
        }
    })

    if (!createdPayments) {
        res.status(400);
        throw new Error("Unable to create payment");
    }

    res.status(200).json(createdPayments);
})