import { Router } from "express";
import multer from "multer";
import fs = require('fs');
import {
    fetchPurchaseOrder,
    //fetchPurchaseOrders,
    fetchPurchaseOrdersList,
    fetchPurchaseOrderByQuery,
    fetchPurchaseOrdersFiltered,
    createPurchaseOrder,
    createProduct,
    deleteProduct,
    editPurchaseOrder,
    addPayment,
    updateStatus
} from "@controllers/purchaseorder.controller"

export const purchaseOrder: Router= Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const { prevPurchaseOrderFile } = req.body;
    if (prevPurchaseOrderFile) {
      let files = fs.readdirSync('public/uploads');
      if (files.includes(prevPurchaseOrderFile)) {
        fs.unlinkSync(`public/uploads/${prevPurchaseOrderFile}`);
      }
    }
    cb(null, true);
  }
})

purchaseOrder.get("/file/:file/fetch", (req, res) => {
  const {file} = req.params;

  let files = fs.readdirSync('public/uploads');

  if (files.includes(file)) {
    res.status(200).sendFile(`public/uploads/${file}`, {root: "./"});
  } else {
    res.status(404)
    throw new Error("File does not exist")
  }
})

purchaseOrder.post("/upload", upload.single('file'), (req, res) => {
  if (!req.file?.filename) {
    throw new Error("There is no file uploaded.")
  }

  const uploadedFile = {
    field: req.file?.fieldname,
    originalName: req.file?.originalname,
    fileName: req.file?.filename,
    path: req.file?.path
  }
  
  res.status(201).json(uploadedFile)
})

purchaseOrder.get("/poNo=:poNo/fetchPurchaseOrder", fetchPurchaseOrder);
//purchaseOrder.get("/fetch", fetchPurchaseOrders);
purchaseOrder.get("/fetch", fetchPurchaseOrdersList)
purchaseOrder.post("/fetch/query", fetchPurchaseOrderByQuery)
purchaseOrder.post("/fetch/filtered", fetchPurchaseOrdersFiltered)
purchaseOrder.post("/create/purchase-order", createPurchaseOrder)
purchaseOrder.post("/set/product", createProduct)
purchaseOrder.delete("/delete/product", deleteProduct)
purchaseOrder.patch("/edit", editPurchaseOrder)
purchaseOrder.patch("/addPayment", addPayment)
purchaseOrder.patch("/updateStatus", updateStatus)