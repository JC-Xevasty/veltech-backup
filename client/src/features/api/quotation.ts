import { baseApi } from "./_base"
import type { Quotation, UploadedFile, User } from "../../types"

export const quotationApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createQuotation: build.mutation<Quotation, Partial<Quotation>>({
            query: ({
                projectType, buildingType, establishmentSizeWidth, establishmentSizeHeight, projectFeatures,
                floorPlan, floorPlanFile, userId
            }) => ({
                url: "/quotations/create",
                method: "POST",
                body: {
                    floorPlanFile,
                    projectType, buildingType, establishmentSizeWidth, establishmentSizeHeight, projectFeatures,
                    floorPlan, userId
                },
            }),
            invalidatesTags: ["Quotations"],
        }),

        quotationUploads: build.mutation<UploadedFile, FormData>({
            query(data) {
                return {
                    url: '/quotations/upload/',
                    method: 'POST',
                    body: data,
                };
            },
        }),

        fetchQuotations: build.query<Quotation[], void>({
            query: () => "/quotations/fetch",
            providesTags: ["Quotations"],
            keepUnusedDataFor: 150,
        }),

        fetchQuotation: build.query<Quotation, Pick<Quotation, "id">>({
            query: ({ id }) => `/quotations/id=${id}/fetch`,
            providesTags: ["Quotation"],
            keepUnusedDataFor: 150
        }),

        fetchClientQuotations: build.query<Quotation[], Pick<User, "id">>({
            query: ({ id }) => `/quotations/uid=${id}/fetch`,
            providesTags: ["Quotations"],
            keepUnusedDataFor: 150,
        }),

        fetchClientQuotation: build.query<Quotation, Pick<Quotation, "id" | "userId">>({
            query: ({ id, userId }) => `/quotations/uid=${userId}/id=${id}/fetch`,
            providesTags: ["Quotation"],
            keepUnusedDataFor: 150
        }),

        fetchQuotationsByQuery: build.query<Quotation[], { query: string }>({
            query: ({ query }) => ({
                url: "/quotations/fetch/query",
                method: "POST",
                body: {
                    query
                }
            }),
            providesTags: ["Quotations"],
            keepUnusedDataFor: 150
        }),

        setQuotationStatus: build.mutation<Quotation, Partial<Quotation>>({
            query: ({ id, quotationStatus }) => ({
                url: "/quotations/update-status",
                method: "PATCH",
                body: { id, quotationStatus },
            }),
            invalidatesTags: ["Quotation", "Quotations"],
        }),

        setProjectCost: build.mutation<Quotation, Partial<Quotation>>({
            query: ({
                id, quotationStatus, materialsCost, laborCost,
                requirementsCost, quotation
            }) => ({
                url: "/quotations/set-cost",
                method: "PATCH",
                body: {
                    id, quotationStatus, materialsCost, laborCost,
                    requirementsCost, quotation
                },
            }),
            invalidatesTags: ["Quotation", "Quotations"],
        })
    })
});

export const {
    useCreateQuotationMutation,
    useFetchQuotationsQuery,
    useFetchQuotationQuery,
    useFetchQuotationsByQueryQuery,
    useFetchClientQuotationsQuery,
    useFetchClientQuotationQuery,
    useSetQuotationStatusMutation,
    useSetProjectCostMutation,
    useQuotationUploadsMutation
} = quotationApi