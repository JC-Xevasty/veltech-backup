import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ process.env.REACT_APP_API_URL }/api`,
    prepareHeaders(headers) {
      return headers
    },
    credentials: "include"
  }),
  tagTypes: [
    "Client", "Clients", "ClientQuotations", "ClientProjects",
    "User", "Users", "Auth", "VerifyToken", "ResetToken",
    "Supplier", "Suppliers",
    "Samples", "Sample",
    "Quotations", "Quotation",
    "PurchaseOrder", "PurchaseOrders","PurchaseOrderItem", "PurchaseOrderItems",
    "Projects", "Project",
    "ProjectMilestones","ProjectMilestone",
    "Payment","Payments",
    "Notification", "Notifications",
    "Inquiry", "Inquiries",
    "Application", "Carousel", "CarouselEntry", "ActivityLogs"
  ],
  endpoints: () => ({})
})