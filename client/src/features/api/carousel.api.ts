import { baseApi } from "./_base"

export interface Carousel {
   id: string
   title: string
   description: string
   status: string
   imgPath: string
   createdAt: string | Date
   updatedAt: string | Date
}

export const carouselApi = baseApi.injectEndpoints({
   endpoints: (build) => ({
      uploadCarouselImage: build.mutation<any, FormData>({
         query: (data) => ({
            url: "/carousel/upload",
            method: "POST",
            body: data
         })
      }),
      createCarouselEntry: build.mutation<Pick<Carousel, "id">, Pick<Carousel, "title" | "description" | "imgPath">>({
         query: (data) => ({
            url: "/carousel/create",
            method: "POST",
            body: data
         }),
         invalidatesTags: ["Carousel"]
      }),
      fetchCarouselEntries: build.query<Carousel[], void>({
         query: () => "/carousel/fetch",
         providesTags: ["Carousel"]
      }),
      fetchCarouselEntry: build.query<Carousel, Pick<Carousel, "id">>({
         query: ({ id }) => `/carousel/id=${ id }/fetch`,
         providesTags: ["CarouselEntry"]
      }),
      updateCarouselEntry: build.mutation<Pick<Carousel, "id">, Pick<Carousel, "id" | "title" | "description" | "imgPath">>({
         query: ({ id, ...data }) => ({
            url: `/carousel/id=${ id }/update`,
            method: "PATCH",
            body: {
               ...data
            }
         }),
         invalidatesTags: ["Carousel", "CarouselEntry"]
      }),
      updateCarouselEntryStatus: build.mutation<Pick<Carousel, "id">, Pick<Carousel, "id" | "status">>({
         query: ({ id, ...data }) => ({
            url: `/carousel/id=${ id }/update/status`,
            method: "PATCH",
            body: {
               ...data
            }
         }),
         invalidatesTags: ["Carousel", "CarouselEntry"]
      })
   })
})

export const {
   useUploadCarouselImageMutation,
   useCreateCarouselEntryMutation,
   useFetchCarouselEntriesQuery,
   useFetchCarouselEntryQuery,
   useUpdateCarouselEntryMutation,
   useUpdateCarouselEntryStatusMutation
} = carouselApi