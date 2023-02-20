import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { SerializedError } from "@reduxjs/toolkit"
import { Location } from "react-router-dom"

export interface LocationState {
  from: Location,
  data: any
}

export interface OutletContext {
  offset?: string
  setTopbarVisible?: (isVisible: boolean) => void
}

export interface ReduxState {
  auth: {
    user: User
  },
}

export interface FieldTypes {
  [key: string]: string
}

export interface Credentials {
  identity: string
  password: string
}

interface ErrorDetails {
  message: string
  stack: string
}

export interface MutationResult<T> {
  data?: Partial<T & ErrorDetails>
  error?: FetchBaseQueryError | SerializedError
}

// Entities
export interface User {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  companyName: string
  username: string
  image:string
  emailAddress: string
  contactNumber: string
  password: string
  isVerified: boolean
  verifyToken: string
  resetToken: string
  type: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface Sample {
  id: string
  name: string
  age: number
  isValid: boolean
}

export interface Quotation {
  id: string
  projectType: string
  buildingType: string
  establishmentSizeWidth: number
  establishmentSizeHeight: number
  projectFeatures: string[]
  floorPlan: string,
  floorPlanFile: File,
  quotationStatus: string,
  user: User
  userId: string
  materialsCost: number
  laborCost: number
  requirementsCost: number
  quotation: string
  createdAt: Date
  updatedAt: Date
}

export interface UploadedFile {
  field: string,
  originalName: string,
  fileName: string,
  path: string
}

export interface UploadedImage{
  field: string,
  originalName: string,
  fileName: string,
  path: string
}

export interface Project{
  id: string
  projectStatus: string
  paymentStatus: string
  quotation: Quotation
  quotationId: string
  contractFileName: string
  signedContractFileName: string
  remainingBalance: number
  projectMilestones: ProjectMilestone[]
  user: User
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProjectMilestone{
  milestoneNo: number,
  price: number,
  description: string,
  estimatedEnd: string,
  startDate: string,
  projectId: string,
  billingStatus: string,
  milestoneStatus: string
  paymentStatus: string
  project?: Project
}

export interface Payment {
  id: string
  project: Project
  projectId: string
  user: User
  userId: string
  imageFileName: string
  referenceNo: string
  amount: string
  currentBalance: number
  category: string
  milestoneNo: number
  dateOfPayment: Date
  paymentStatus: string
  createdAt: Date
  updateddAt: Date
}

export interface Activities {
  id: String
  userRole: String
  entry: String
  module: String
  category: String
  loggedAt: String
  status: String
}

export interface Supplier {
  id: String
  name: String
}

export interface PurchaseOrder {
  id: string
  poNo: string
  projectId: string
  project: Project
  terms: string
  total: number
  deliverTo: string
  items: PurchaseOrderItem[]
  preparedBy: User
  preparedById: string
  approvedBy: User
  approvedById: string
  purchaseOrderstatus: string
  supplierId: string
  supplier: Supplier
  poDocument: string
  contact: string
  payment: string[]
  paymentProof: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrderItem {
  id: string
  description: string
  unit: string
  unitCost: number
  quantity: number
  purchaseOrder: PurchaseOrder
  purchaseOrderId: string
  netPrice: string
  entry: string
  createdAt: Date
  updatedAt: Date
}