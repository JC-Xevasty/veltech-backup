import { baseApi } from "./_base"

export interface Application {
   id: string
   appName: string
   companyName: string
   companyAddress: string
   companyContactNumber: string
   companyEmailAddress: string
   logoPath?: string
   faviconPath?: string
   headerPath?: string
}

export const applicationApi = baseApi.injectEndpoints({
   endpoints: (build) => ({
      fetchApplication: build.query<Application, void>({
         query: () => "/application/fetch",
         providesTags: ["Application"]
      }),

      resetApplication: build.mutation<Application, Application>({
         query: ({ id, ...args }) => ({
            url: `/application/id=${ id }/reset`,
            method: "POST",
            body: {
               ...args
            }
         }),
         invalidatesTags: ["Application"]
      }),

      uploadApplicationImages: build.mutation<any, FormData>({
         query: (images) => ({
            url: "/application/upload/images",
            method: "POST",
            body: images
         })
      }),

      updateApplication: build.mutation<Application, Application>({
         query: ({ id, ...args }) => ({
            url: `/application/id=${ id }/update`,
            method: "PUT",
            body: {
               ...args
            }
         }),
         invalidatesTags: ["Application"]
      })
   })
})

export const {
   useFetchApplicationQuery,
   useResetApplicationMutation,
   useUploadApplicationImagesMutation,
   useUpdateApplicationMutation
} = applicationApi