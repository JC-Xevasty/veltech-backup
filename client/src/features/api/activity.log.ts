import { baseApi } from "./_base"
import { Activities } from "../../types"


export const activityLogsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchActivities: build.query<Activities[], Pick<Activities, "category" | "userRole">>({
            query: (data) => ({
                url: "/activity_logs/fetch",
                method: "POST",
                body: data
            }),
            providesTags: ["ActivityLogs"]
        }),

        createActivity: build.mutation<Activities, Partial<Activities>>({
            query: ({ id, userRole,entry,module,category,loggedAt,status }) => ({
                url: "/activity_logs/create",
                method: "POST",
                body: { id, userRole,entry,module,category,loggedAt,status }
            }),
            invalidatesTags: ["ActivityLogs"],
        })
    })
})

export const {
    useFetchActivitiesQuery,
    useCreateActivityMutation,
} = activityLogsApi