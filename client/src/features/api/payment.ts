import { baseApi } from "./_base"
import type { Payment, UploadedFile, User, Project } from "../../types"

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchPayments: build.query<Payment[], { query: String, paymentStatus: String }>({
            query: ({ query, paymentStatus }) => ({
                url: "/payments/fetch/",
                method: "POST",
                body: {
                    query, paymentStatus
                }
            }),
            providesTags: ["Payments"],
            keepUnusedDataFor: 150
        }),

        fetchClientPayments: build.query<Payment[], Pick<User, "id">>({
            query: ({ id }) => `/payments/uid=${id}/fetch`,
            providesTags: ["Payments"],
            keepUnusedDataFor: 150
        }),

        acceptPayment: build.mutation<Payment, Partial<Payment>>({
            query: ({ id }) => ({
                url: "/payments/accept",
                method: "PATCH",
                body: { id },
            }),
            invalidatesTags: ["Payments", "Payment"],
        }),

        updateBalance: build.mutation<Project, Partial<Payment> & Pick<Project, "remainingBalance">>({
            query: ({ projectId, remainingBalance, amount, category, milestoneNo }) => ({
                url: "/payments/update-balance",
                method: "PATCH",
                body: { projectId, remainingBalance, amount, category, milestoneNo },
            }),
            invalidatesTags: ["Projects", "Project"],
        }),

        rejectPayment: build.mutation<Payment, Partial<Payment>>({
            query: ({ id }) => ({
                url: "/payments/reject",
                method: "PATCH",
                body: { id },
            }),
            invalidatesTags: ["Payments", "Payment"],
        }),

        paymentUploads: build.mutation<UploadedFile, FormData>({
            query(data) {
                return {
                    url: '/payments/upload/',
                    method: 'POST',
                    body: data,
                };
            },
        }),

        createPayment: build.mutation<Payment, Partial<Payment>>({
            query: ({
                projectId, userId, imageFileName, referenceNo, amount, category, milestoneNo, dateOfPayment
            }) => ({
                url: "/payments/create",
                method: "POST",
                body: {
                    projectId, userId, imageFileName, referenceNo, amount, category, milestoneNo, dateOfPayment
                },
            }),
            invalidatesTags: ["Payments"],
        }),
    })
});

export const {
    useFetchPaymentsQuery,
    useFetchClientPaymentsQuery,
    useRejectPaymentMutation,
    useUpdateBalanceMutation,
    useAcceptPaymentMutation,
    usePaymentUploadsMutation,
    useCreatePaymentMutation
} = paymentApi