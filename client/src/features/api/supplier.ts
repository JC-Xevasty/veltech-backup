import { baseApi } from "./_base"

export const supplierApi = baseApi.injectEndpoints({
   endpoints: (build) => ({
      fetchSuppliers: build.query<any, any>({
         query: (args) => ({
            url: "/suppliers/fetch",
            method: "POST",
            body: args
         }),
         providesTags: ["Suppliers"]
      }),

      fetchSupplier: build.query<any, any>({
         query: (args) => `/suppliers/id=${ args.id }/fetch`,
         providesTags: ["Supplier"]
      }),

      createSupplier: build.mutation<any, any>({
         query: (args) => ({
            url: "/suppliers/create",
            method: "POST",
            body: args
         }),
         invalidatesTags: ["Suppliers"]
      }),

      updateSupplier: build.mutation<any, any>({
         query: ({ id, ...args }) => ({
            url: `/suppliers/id=${ id }/update`,
            method: "POST",
            body: {
               ...args
            }
         }),
         invalidatesTags: ["Supplier", "Suppliers"]
      })
   })
})

export const {
   useFetchSuppliersQuery,
   useFetchSupplierQuery,
   useCreateSupplierMutation,
   useUpdateSupplierMutation
} = supplierApi