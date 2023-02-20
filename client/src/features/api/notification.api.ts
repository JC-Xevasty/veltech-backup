import { baseApi } from "./_base"
import type { User, Project, Quotation } from "../../types"

export interface Notification {
   id: string
   origin: "QUOTATION" | "PROJECT"
   title: string
   body: string
   isRead: boolean
   userId: string
   user: User
   quotationId?: string
   quotation?: Quotation
   projectId?: string
   project?: Project
   createdAt: string
   updatedAt: string
}

export const notificationApi = baseApi.injectEndpoints({
   endpoints: (build) => ({
      fetchNotifications: build.query<Notification[], Pick<Notification, "userId">>({
         query: ({ userId }) => `/notifications/user=${ userId }/fetch`,
         providesTags: ["Notifications"]
      }),
      
      createNotification: build.mutation<Notification, Partial<Notification>>({
         query: ({ origin, body, title, userId, quotationId, projectId }) => ({
            url: "/notifications/create",
            method: "POST",
            body: {
               origin, body, title, userId, quotationId, projectId
            }
         }),
         invalidatesTags: ["Notifications"]
      }) 
   }),
})

export const {
   useFetchNotificationsQuery,
   useCreateNotificationMutation
} = notificationApi