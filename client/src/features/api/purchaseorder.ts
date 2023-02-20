import { baseApi } from "./_base"
import type { PurchaseOrder, PurchaseOrderItem, UploadedFile } from "../../types";

export const purchaseOrderApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchPurchaseOrder: build.query<PurchaseOrder, Pick<PurchaseOrder, "poNo">>({
            query: ({ poNo }) => `/purchase-orders/poNo=${poNo}/fetchPurchaseOrder`,
            providesTags: ["PurchaseOrder"],
            keepUnusedDataFor: 150
        }),

        fetchPurchaseOrderList: build.query<PurchaseOrder[], void>({
            query: () => `/purchase-orders/fetch`,
            providesTags: ["PurchaseOrders"],
            keepUnusedDataFor: 150
        }),

        createPurchaseOrder: build.mutation<PurchaseOrder, Partial<PurchaseOrder>>({
            query: ({
                projectId, supplierId, poNo, terms, deliverTo, approvedById, purchaseOrderstatus, total, preparedById, poDocument, contact
            }) => ({
                url: '/purchase-orders/create/purchase-order',
                method: 'POST',
                body: {
                    projectId, supplierId, poNo, deliverTo, approvedById, terms, purchaseOrderstatus, total, preparedById, poDocument, contact
                }
            }),
        }),

        createProducts: build.mutation<PurchaseOrderItem, Partial<PurchaseOrderItem>>({
            query: ({
                description, unit, netPrice, quantity, purchaseOrderId
            }) => ({
                url: '/purchase-orders/set/product',
                method: 'POST',
                body: {
                    description, unit, netPrice, quantity, purchaseOrderId
                }
            }),
            invalidatesTags: ["PurchaseOrderItem", "PurchaseOrderItems"]
        }),

        poDocumentUploads: build.mutation<UploadedFile, FormData>({
            query(data) {
                return {
                    url: '/purchase-orders/upload/',
                    method: 'POST',
                    body: data,
                };
            },
        }),
        fetchPurchaseOrderByQuery: build.query<any, { query: string }>({
            query: ({ query }) => ({
                url: "/purchase-orders/fetch/query",
                method: "POST",
                body: {
                    query
                }
            }),
            providesTags: ["PurchaseOrders"],
            keepUnusedDataFor: 150
        }),

        fetchPurchaseOrderFiltered: build.query<any, { search: string }>({
            query: ({ search }) => ({
                url: "/purchase-orders/fetch/filtered",
                method: "POST",
                body: {
                    search
                }
            }),
            providesTags: ["PurchaseOrders"]
        }),

        editPurchaseOrder: build.mutation<any, any>({
            query: ({ id, deliverTo, contact, total, terms, poDocument }) => ({
                url: `/purchase-orders/edit`,
                method: "PATCH",
                body: {
                    id, deliverTo, contact, total, terms, poDocument
                }
            }),
            invalidatesTags: ["PurchaseOrder", "PurchaseOrders"]
        }),

        deleteProduct: build.mutation<any, any>({
            query: ({ purchaseOrderId }) => ({
                url: `/purchase-orders/delete/product`,
                method: "DELETE",
                body: {
                    purchaseOrderId
                }
            }),
            invalidatesTags: ["PurchaseOrder", "PurchaseOrders"]
        }),

        addPayment: build.mutation<any, any>({
            query: ({ id, payment, paymentProof }) => ({
                url: `/purchase-orders/addPayment`,
                method: "PATCH",
                body: {
                    id,
                    payment, paymentProof
                }
            }),
            invalidatesTags: ["PurchaseOrder", "PurchaseOrders"]
        }),

        setStatus: build.mutation<any, any>({
            query: ({ id, purchaseOrderstatus }) => ({
                url: `/purchase-orders/updateStatus`,
                method: "PATCH",
                body: {
                    id,
                    purchaseOrderstatus
                }
            }),
            invalidatesTags: ["PurchaseOrder", "PurchaseOrders"]
        }),
    }),
});


export const {
    useFetchPurchaseOrderListQuery,
    useFetchPurchaseOrderQuery,
    useCreateProductsMutation,
    useCreatePurchaseOrderMutation,
    usePoDocumentUploadsMutation,
    useFetchPurchaseOrderByQueryQuery,
    useFetchPurchaseOrderFilteredQuery,
    useEditPurchaseOrderMutation,
    useAddPaymentMutation,
    useDeleteProductMutation,
    useSetStatusMutation
} = purchaseOrderApi