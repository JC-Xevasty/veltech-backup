import { Request, Response } from "express";
import { config } from "dotenv";
import asyncHandler from "express-async-handler";
import { prisma } from "@config/prisma.config";
import { purchaseOrder } from "@routers/purchaseorder.router";

config();

export const fetchPurchaseOrdersList = asyncHandler(async (req: Request, res: Response) => {
    const fetchedPurchaseOrder = await prisma.purchase_Order.findMany({
        where: {},
        select: {
            id: true,
            poNo: true,
            project: true,
            supplier: true,
            createdAt: true,
            purchaseOrderstatus: true,
            preparedBy: true,
            approvedBy: true,
        }
    });

    if (!fetchedPurchaseOrder) {
        res.status(400)
        throw new Error("Unable to fetch Purchase Orders.")
    }

    res.status(200).json(fetchedPurchaseOrder)
});

export const fetchPurchaseOrder = asyncHandler(async (req: Request, res: Response) => {
    const { poNo } = req.params;

    let fetchedPurchaseOrder = await prisma.purchase_Order.findFirst({
        where: { poNo },
        select: {
            id: true,
            poNo: true,
            project: true,
            projectId: true,
            terms: true,
            total: true,
            deliverTo: true,
            items: true,
            preparedBy: true,
            preparedById: true,
            approvedBy: true,
            approvedById: true,
            purchaseOrderstatus: true,
            purchaseOrderLogs: true,
            supplier: true,
            supplierId: true,
            contact: true,
            poDocument: true,
            payment: true,
            paymentProof: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!fetchedPurchaseOrder) {
        res.status(400);
        throw new Error("Unable to fetch Purchase Order.");
    }

    res.status(200).json(fetchedPurchaseOrder);
});

export const createPurchaseOrder = asyncHandler(async (req: Request, res: Response) => {

    let {
        preparedById, approvedById,
        projectId, supplierId,
        poNo, terms, deliverTo, total, purchaseOrderstatus, poDocument,
        contact
    } = req.body

    if (!preparedById) {
        res.status(400);
        throw new Error(`Missing Authorize User${preparedById}`);
    }

    if (!projectId) {
        res.status(400);
        throw new Error("Must select Project.");
    }

    if (!supplierId) {
        res.status(400);
        throw new Error("Must select Supplier.");
    }

    if (!poNo || !terms || !deliverTo || !total || !purchaseOrderstatus || !contact) {
        res.status(400);
        throw new Error(`Incomplete Input.`);
    }

    if (!poDocument) {
        res.status(400);
        throw new Error(`Missing File.`);
    }

    const createdPurchaseOrder = await prisma.purchase_Order.create({
        data: {
            poNo, projectId, terms, deliverTo, preparedById, approvedById, supplierId, total, purchaseOrderstatus, poDocument,
            contact: contact ?? " "
        }
    })

    if (!createdPurchaseOrder) {
        res.status(400);
        throw new Error("Unable to request Purchase Order");
    }

    res.status(201).json(createdPurchaseOrder);
})

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { purchaseOrderId,
        description, netPrice, quantity,
        unit
    } = req.body

    if (!purchaseOrderId) {
        res.status(400);
        throw new Error("Unable to get PurchaseOrderId");
    }

    if (!description || !netPrice || !quantity || !unit) {
        res.status(400);
        throw new Error(`${description} ${netPrice}, ${quantity} ${unit}`);
    }

    const createdProduct = await prisma.purchase_Order_Item.create({
        data: {
            description, quantity, purchaseOrderId, unit, netPrice
        }
    })

    if (!createdProduct) {
        res.status(400);
        throw new Error("Unable to request Purchase Order Product.");
    }

    res.status(201).json(createdProduct);
})

export const fetchPurchaseOrdersFiltered = asyncHandler(async (req, res) => {
    let fetch = await prisma.purchase_Order.findMany({
        include: {
            supplier: true,
            preparedBy: true,
            approvedBy: true,
            project: true,
            items: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    if (!fetch) {
        throw new Error("Unable to fetch purchase orders.")
    }

    const { search } = req.body

    if (search) fetch = fetch.filter(purchaseOrder => {
        const regex = new RegExp(search, "i")
        return regex.test(purchaseOrder.supplier.name)
    })

    res.status(200).json(fetch)
})

export const fetchPurchaseOrderByQuery = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body;

    const fetchedPurchaseOrderByQuery = await prisma.purchase_Order.findMany({
        where: {
            ...((query != null && query != "") && {
                supplier: {
                    name: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            })
        },
        select: {
            id: true,
            poNo: true,
            project: true,
            projectId: true,
            terms: true,
            total: true,
            deliverTo: true,
            items: true,
            preparedBy: true,
            preparedById: true,
            approvedBy: true,
            approvedById: true,
            purchaseOrderstatus: true,
            purchaseOrderLogs: true,
            supplier: true,
            supplierId: true,
            poDocument: true,
            payment: true,
            paymentProof: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: { createdAt: 'desc' }

    })

    if (!fetchedPurchaseOrderByQuery) {
        res.status(400);
        throw new Error("Unable to fetch quotations based on query");
    }

    res.status(200).json(fetchedPurchaseOrderByQuery);
})

export const editPurchaseOrder = asyncHandler(async (req: Request, res: Response) => {

    let {
        id,
        terms, deliverTo, total, poDocument,
        contact
    } = req.body



    if (!terms || !deliverTo || !total || !contact) {
        res.status(400);
        throw new Error(`${terms} ${deliverTo} ${total} ${poDocument}`);
    }

    if (!poDocument) {
        res.status(400);
        throw new Error(`Missing File.`);
    }

    const editedPurchaseOrder = await prisma.purchase_Order.update({
        where: {
            id
        },
        data: {
            terms, deliverTo, total, poDocument, contact
        }
    })

    if (!editedPurchaseOrder) {
        res.status(400);
        throw new Error("Unable to request Purchase Order");
    }

    res.status(201).json(editedPurchaseOrder);
})

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    let {
        purchaseOrderId
    } = req.body

    const deleteProduct = await prisma.purchase_Order_Item.deleteMany({
        where: {
            purchaseOrderId
        }
    })

    if (!deleteProduct) {
        res.status(400);
        throw new Error("Unable to delete products");
    }

    res.status(201).json(deleteProduct)
})

export const addPayment = asyncHandler(async (req: Request, res: Response) => {
    let {
        id,
        payment, paymentProof
    } = req.body

    const addPayment = await prisma.purchase_Order.update({
        where: {
            id
        },
        data: {
            payment, paymentProof
        }
    })

    if (!addPayment) {
        res.status(400);
        throw new Error("Unable to add Payment");
    }

    res.status(201).json(addPayment)
})

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
    let {
        id,
        purchaseOrderstatus
    } = req.body

    const updatedStatus = await prisma.purchase_Order.update({
        where: {
            id
        },
        data: {
            purchaseOrderstatus
        }
    })

    if (!updatedStatus) {
        res.status(400);
        throw new Error("Unable to patch status");
    }

    res.status(201).json(updatedStatus)
})