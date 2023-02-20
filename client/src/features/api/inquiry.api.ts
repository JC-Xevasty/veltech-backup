import { baseApi } from "./_base"

export interface Inquiry {
   id: string
   subject: string
   fullName: string
   companyName: string
   emailAddress: string
   message: string
   isReplied: boolean
   createdAt: Date | string
}

export const inquiryApi = baseApi.injectEndpoints({
   endpoints: (build) => ({
      fetchInquiry: build.query<Inquiry, Pick<Inquiry, "id">>({
         query: ({ id }) => `/inquiries/id=${ id }/fetch`,
         providesTags: ["Inquiry"]
      }),

      fetchInquiries: build.query<Inquiry[], { search: string }>({
         query: (data) => ({
            url: "/inquiries/fetch",
            method: "POST",
            body: data
         }),
         providesTags: ["Inquiries"]
      }),

      createInquiry: build.mutation<Inquiry, Partial<Inquiry>>({
         query: (data) => ({
            url: "/inquiries/create",
            method: "POST",
            body: data
         }),
         invalidatesTags: ["Inquiries"]
      }),

      updateInquiryIsReplied: build.mutation<Inquiry, Pick<Inquiry, "id" | "isReplied">>({
         query: ({ id, ...data }) => ({
            url: `/inquiries/id=${ id }/update/is-replied`,
            method: "PATCH",
            body: data
         }),
         invalidatesTags: ["Inquiry", "Inquiries"]
      })
   })
})

export const {
   useFetchInquiryQuery,
   useFetchInquiriesQuery,
   useCreateInquiryMutation,
   useUpdateInquiryIsRepliedMutation
} = inquiryApi