import { Request, Response } from "express"
import { config } from "dotenv"
import asyncHandler from "express-async-handler"
import { prisma } from "@config/prisma.config"

config();

export const fetchProjects = asyncHandler(async (req: Request, res: Response) => {
    const fetchedProjects = await prisma.project.findMany({
        where: {},
        select: {
            id: true,
            projectStatus: true,
            paymentStatus: true,
        }
    })

    if (!fetchedProjects) {
        res.status(400)
        throw new Error("Unable to fetch projects.")
    }

    res.status(200).json(fetchedProjects)
});

export const fetchProject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const fetchedProject = await prisma.project.findFirst({
        where: { id },
        include:{
            user: {
                select:{
                    firstName: true, middleName: true,
                    lastName: true, suffix: true, emailAddress: true,
                    companyName: true, contactNumber: true,
                }
            },
            quotation:{
                select:{
                    projectType:true, buildingType:true,
                    establishmentSizeWidth:true, establishmentSizeHeight: true, projectFeatures: true,
                    floorPlan: true, materialsCost:true, requirementsCost:true,
                    laborCost: true
                },
            },
            projectMilestones: true
        },
    })

    if (!fetchedProject) {
        res.status(400)
        throw new Error("Unable to find or fetch project.")
    }

    res.status(200).json(fetchedProject)
});

export const fetchClientProjects = asyncHandler(async (req: Request, res: Response) => {
    const { uid } = req.params;

    const fetchedClientProjects = await prisma.project.findMany({
        where: { userId: uid },
        orderBy: { createdAt: 'desc' }
    });

    if (!fetchedClientProjects) {
        res.status(400);
        throw new Error("Unable to fetch client projects");
    }

    res.status(200).json(fetchedClientProjects);
});

export const fetchClientProject = asyncHandler(async (req: Request, res: Response) => {
    const { id, uid } = req.params;

    const fetchedClientProject = await prisma.project.findFirst({
        where: { id, userId: uid },
        include: {
            user: {
                select: {
                    firstName: true, middleName: true,
                    lastName: true, suffix: true, emailAddress: true,
                    companyName: true, contactNumber: true
                }
            },
            quotation:{
                select:{
                    projectType:true, buildingType:true,
                    establishmentSizeWidth:true, establishmentSizeHeight: true, projectFeatures: true,
                    floorPlan: true, materialsCost: true, laborCost:true,
                    requirementsCost:true
                }
            },
            projectMilestones:{
                select:{
                    milestoneNo:true, milestoneStatus: true,
                    description:true, estimatedEnd:true,
                    startDate:true, billingStatus:true,
                    paymentStatus:true, price:true,projectId:true
                }
            }
        }

    });

    if (!fetchedClientProject) {
        res.status(400);
        throw new Error("Unable to fetch client project");
    }

    res.status(200).json(fetchedClientProject);
});

export const fetchProjectsByQuery = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body;

    const fetchedProjectsByQuery = await prisma.project.findMany({
        where: {
            ...((query != null && query != "" ) && {
                user:{
                    companyName:{
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
                    companyName: true, contactNumber: true
                }
            },
            quotation:{
                select:{
                    projectType:true, buildingType:true,
                    establishmentSizeWidth:true, establishmentSizeHeight: true, projectFeatures: true,
                    floorPlan: true, materialsCost: true, laborCost:true,
                    requirementsCost:true
                }
            },
            projectMilestones:{
                select:{
                    milestoneNo:true, milestoneStatus: true,
                    description:true, estimatedEnd:true,
                    startDate:true, billingStatus:true,
                    paymentStatus:true, price:true,projectId:true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    if (!fetchedProjectsByQuery) {
        res.status(400);
        throw new Error("Unable to fetch projects based on query");
    }

    res.status(200).json(fetchedProjectsByQuery);
})

export const createProject = asyncHandler(async (req: Request, res: Response) =>{
    let {
        quotationId,
        userId,
        contractFileName,
        signedContractFileName,
        remainingBalance
    } = req.body

    const fetchedUser = await prisma.user.findFirst({ where: { id: userId } });

    if (!fetchedUser) {
        res.status(400);
        throw new Error("Unable to create project");
    }

    const fetchedQuotation = await prisma.quotation.findFirst({where: {id:quotationId}})

    if (!fetchedQuotation) {
        res.status(400);
        throw new Error("Unable to create a project");
    }

    const createdProject = await prisma.project.create({
        data:{
            userId, quotationId, contractFileName, signedContractFileName, remainingBalance
        }
    });

    if (!createdProject) {
        res.status(400);
        throw new Error("Unable to create a project");
    }

    res.status(200).json(createdProject)
});



export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedProject = await prisma.project.delete({
        where: {
            id
        }
    });

    if (!deletedProject) {
        res.status(400)
        throw new Error("Unable to delete quotation");
    }

    res.status(201).json(deletedProject);
});


export const setProjectStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id, projectStatus } = req.body;
    try {
        const updatedProject = await prisma.project.update({
            where: { id },
            data: { projectStatus }
        })

        res.status(201).json(updatedProject);
    } catch (error) {
        res.status(400)
        throw new Error("Unable to update project status");
    }
});

export const setPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id, paymentStatus} = req.body;
    try {
        const updatedProject = await prisma.project.update({
            where: { id },
            data: { paymentStatus}
        })

        res.status(201).json(updatedProject);
    } catch (error) {
        res.status(400)
        throw new Error("Unable to update payment status");
    }
});

export const updateContract = asyncHandler(async (req: Request, res: Response) =>{
    let {
        id,
        contractFileName
    } = req.body

    if (!id || !contractFileName){
        res.status(400)
        throw new Error("Incomplete input")
    }

    const updateContractFileName = await prisma.project.update({
        where: {
            id 
        }, 
        data:{
            contractFileName
        }
    })
    
    if(!updateContractFileName){
        res.status(400)
        throw new Error("Unable to add contract")
    }
    res.status(201).json(updateContractFileName)
})

export const updateSignedContract = asyncHandler(async (req: Request, res: Response) =>{
    let {
        id,
        signedContractFileName
    } = req.body

    if (!id || !signedContractFileName){
        res.status(400)
        throw new Error("Incomplete input")
    }

    const updateSignedContractFileName = await prisma.project.update({
        where: {
            id 
        }, 
        data:{
            signedContractFileName
        }
    })
    
    if(!updateSignedContractFileName){
        res.status(400)
        throw new Error("Unable to add contract")
    }
    res.status(201).json(updateSignedContractFileName)
})

export const createMilestone = asyncHandler(async (req: Request,res: Response)=>{

    let {
        milestoneNo,
        price,
        description,
        estimatedEnd,
        startDate,
        projectId,
        billingStatus,
        milestoneStatus,
        paymentStatus
    } = req.body

    const fetchedProject = await prisma.project.findFirst({where:{id: projectId}});

    if(!fetchedProject){
        res.status(400);
        throw new Error("Unable to create milestone")
    }

    const createdMilestone = await prisma.project_Milestone.create({
        data: {
            milestoneNo,
            price,
            description,
            estimatedEnd: new Date(estimatedEnd),
            startDate: new Date(startDate),
            projectId,
            billingStatus,
            milestoneStatus,
            paymentStatus,
        }
    });

    if(!createdMilestone){
        res.status(400)
        throw new Error("Unable to create milestone")
    }

    res.status(200).json(createdMilestone);
})

export const editMilestone = asyncHandler(async (req: Request, res: Response) => {
    const { milestoneNo, projectId } = req.params

    const { description, price, estimatedEnd, startDate } = req.body

    if (!milestoneNo || !projectId || !description || !price || !estimatedEnd || !startDate) {
        throw new Error("Incomplete input")
    }

    const update = await prisma.project_Milestone.update({
        where: {
            milestoneNo_projectId: {
                milestoneNo: +milestoneNo,
                projectId
            }
        },
        data: {
            description,
            price,
            estimatedEnd: new Date(estimatedEnd),
            startDate: new Date(startDate)
        }
    })

    if (!update) {
        throw new Error("Unable to update milestone.")
    }

    res.status(200).json(update)
})

export const fetchMilestones =asyncHandler (async(req: Request, res: Response)=>{
    const {projectId} = req.params

    const fetchedMilestones = await prisma.project_Milestone.findMany({
        where:{
            projectId: projectId
        }
    })

    if(!fetchedMilestones){
        res.status(400)
        throw new Error("Unable to create milestone")
    }
    res.status(200).json(fetchedMilestones)
})

export const updateMilestoneStatus = asyncHandler(async (req: Request, res: Response) => {
    const { milestoneNo, projectId } = req.params

    const { milestoneStatus } = req.body

    if (!milestoneNo || !projectId || !milestoneStatus) {
        throw new Error("Invalid input.")
    }

    const update = await prisma.project_Milestone.update({
        where: {
            milestoneNo_projectId: {
                milestoneNo: +milestoneNo,
                projectId
            }
        },
        data: {
            milestoneStatus
        },
        include: {
            project: {
                include: {
                    user: true
                }
            }
        }
    })

    if (!update) {
        throw new Error("Unable to update progress billing status.")
    }

    res.status(200).json(update)
})

export const updateMilestoneBillingStatus = asyncHandler(async (req: Request, res: Response) => {
    const { milestoneNo, projectId } = req.params

    const { billingStatus, remainingBalance } = req.body

    if (!milestoneNo || !projectId || !billingStatus) {
        throw new Error("Invalid input.")
    }

    const update = await prisma.project_Milestone.update({
        where: {
            milestoneNo_projectId: {
                milestoneNo: +milestoneNo,
                projectId
            }
        },
        data: {
            billingStatus
        }
    })

    if (!update) {
        throw new Error("Unable to update progress billing status.")
    }

    const updateProject = await prisma.project.update({
        where: {
            id: projectId
        },
        data: {
            remainingBalance
        }
    })

    if (!updateProject) {
        throw new Error("Unable to update progress billing status.")
    }

    res.status(200).json(update)
})

export const fetchMilestone =asyncHandler (async(req: Request, res: Response)=>{
    const {milestoneNo,projectId} = req.params

    const fetchedMilestones = await prisma.project_Milestone.findUnique({
        where:{
            milestoneNo_projectId: {
                milestoneNo: +milestoneNo,
                projectId
            }
        }
   })
})


