import { baseApi } from "./_base"

export const clientApi = baseApi.injectEndpoints({
   endpoints: (build) => ({
      fetchClients: build.query<any, { search: string }>({
         query: ({ search }) => ({
            url: "/clients/fetch",
            method: "POST",
            body: {
               search
            }
         }),
         providesTags: ["Clients"]
      }),

      fetchClient: build.query<any, { id: string }>({
         query: ({ id }) => `/clients/id=${ id }/fetch`,
         providesTags: ["Client"]
      }),

      fetchClientQuotations: build.query<any, { id: string }>({
         query: ({ id }) => `/clients/id=${ id }/fetch/quotations`,
         providesTags: ["ClientQuotations"]
      }),

      fetchClientProjects: build.query<any, { id: string }>({
         query: ({ id }) => `/clients/id=${ id }/fetch/projects`,
         providesTags: ["ClientProjects"]
      })
   })
})

export const {
   useFetchClientsQuery,
   useFetchClientQuery,
   useFetchClientQuotationsQuery,
   useFetchClientProjectsQuery
} = clientApi