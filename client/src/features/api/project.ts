import { baseApi } from "./_base"
import type { Project, User, UploadedFile, ProjectMilestone} from "../../types"

export const projectApi =baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchProjects: build.query<Project[],void>({
            query:() =>"/projects/fetch",
            providesTags: ["Projects"],
            keepUnusedDataFor:150,
        }),

        fetchProject: build.query<Project,Pick<Project,"id">>({
            query: ({id}) => `/projects/id=${id}/fetch`,
            providesTags: ["Project"],
            keepUnusedDataFor:150,
        }),

        fetchClientProjects: build.query<Project[],Pick<User,"id">>({
            query: ({id}) => `/projects/uid=${id}/fetch`,
            providesTags: ["Projects"],
            keepUnusedDataFor: 150
        }),

        fetchClientProject: build.query<Project,Pick<Project,"id" | "userId">>({
            query:({id, userId}) => `/projects/uid=${userId}/id=${id}/fetch`,
            providesTags:["Project"],
            keepUnusedDataFor:150
        }),

        fetchProjectsByQuery: build.query<any, { query: string }>({
            query: ({ query }) => ({
                url: "/projects/fetch/query",
                method: "POST",
                body: {
                    query
                }
            }),
            providesTags: ["Projects"],
            keepUnusedDataFor: 150
        }),

        createClientProject: build.mutation<Project,Partial<Project>>({
            query:({
                userId, quotationId,contractFileName,signedContractFileName, remainingBalance
            }) => ({
                url:"projects/create",
                method: "POST",
                body:{
                    userId,
                    quotationId,
                    contractFileName, 
                    signedContractFileName,
                    remainingBalance
                },
            }), 
            invalidatesTags: ["Project", "Projects"]
        }),

        contractUploads: build.mutation<UploadedFile, FormData>({
            query(data) {
                return {
                    url: '/projects/upload/',
                    method: 'POST',
                    body: data,
                };
            },
        }),

        signedContractUploads: build.mutation<UploadedFile, FormData>({
            query(data) {
                return {
                    url: '/projects/upload/',
                    method: 'POST',
                    body: data,
                };
            },
        }),

        setProjectStatus: build.mutation<Project, Partial<Project>>({
            query: ({ id, projectStatus }) => ({
                url: "/projects/update-project-status",
                method: "PATCH",
                body: { id, projectStatus },
            }),
            invalidatesTags: ["Project", "Projects"],
        }),

        setPaymentStatus: build.mutation<Project, Partial<Project>>({
            query: ({ id, paymentStatus }) => ({
                url: "/projects/update-payment-status",
                method: "PATCH",
                body: { id, paymentStatus },
            }),
            invalidatesTags: ["Project", "Projects"],
        }),

        updateContract: build.mutation<Project,Partial<Project>>({
            query:({
                contractFileName,id
            }) => ({
                url: `/projects/update-contract/id=${id}`,
                method: "PATCH",
                body:{
                    id,
                    contractFileName
                }
            }),
            invalidatesTags: ["Project","Projects"]
        }),

        updateSignedContract: build.mutation<Project,Partial<Project>>({
            query:({
                signedContractFileName,id
            }) =>({
                url: `/projects/update-signed-contract/id=${id}`,
                method: "PATCH",
                body:{
                    id,
                    signedContractFileName
                }
            }),
            invalidatesTags:["Project","Projects"]
        }),

        createMilestone: build.mutation<ProjectMilestone,Partial<ProjectMilestone>>({
            query: ({ 
                    milestoneNo, price, description,
                    estimatedEnd,startDate,projectId,
                    billingStatus, milestoneStatus,
                    paymentStatus
            }) => ({
                url: "/projects/create-milestone",
                method: "POST",
                body:{
                    milestoneNo, price, description,
                    estimatedEnd,startDate,projectId,
                    billingStatus, milestoneStatus,
                    paymentStatus
                }
            }),
            invalidatesTags:["ProjectMilestones"]
        }),

        updateMilestone: build.mutation<ProjectMilestone, Partial<ProjectMilestone>>({
            query: ({ 
                milestoneNo, price, description,
                estimatedEnd, startDate, projectId
            }) => ({
                url: `/projects/update/milestone=${ milestoneNo }/project=${ projectId }`,
                method: "PATCH",
                body: {
                    price, description,
                    estimatedEnd, startDate
                }
            }),
            invalidatesTags:["ProjectMilestone", "ProjectMilestones"]
        }),

        updateMilestoneStatus: build.mutation<ProjectMilestone, Partial<ProjectMilestone>>({
            query: ({ 
                milestoneNo, milestoneStatus, projectId
            }) => ({
                url: `/projects/update/milestone=${ milestoneNo }/project=${ projectId }/status`,
                method: "PATCH",
                body: {
                    milestoneStatus
                }
            }),
            invalidatesTags:["ProjectMilestone", "ProjectMilestones"]
        }),

        updateMilestoneBillingStatus: build.mutation<ProjectMilestone, Partial<ProjectMilestone> & Pick<Project, "remainingBalance">>({
            query: ({ 
                milestoneNo, billingStatus, projectId, remainingBalance
            }) => ({
                url: `/projects/update/milestone=${ milestoneNo }/project=${ projectId }/billing/status`,
                method: "PATCH",
                body: {
                    billingStatus,
                    remainingBalance
                }
            }),
            invalidatesTags:["Project", "Projects", "ProjectMilestone", "ProjectMilestones"]
        }),

        fetchMilestones: build.query<ProjectMilestone[],Pick<ProjectMilestone,"projectId">>({
            query:({projectId}) => `/projects/projectId=${projectId}/fetch`,
            providesTags:["ProjectMilestones"],
            keepUnusedDataFor:150
        })

    })
})

export const {
    useFetchProjectQuery,
    useFetchProjectsQuery,
    useFetchClientProjectsQuery,
    useFetchClientProjectQuery,
    useFetchProjectsByQueryQuery,
    useContractUploadsMutation,
    useSignedContractUploadsMutation,
    useCreateClientProjectMutation,
    useSetProjectStatusMutation,
    useSetPaymentStatusMutation,
    useUpdateContractMutation,
    useCreateMilestoneMutation,
    useUpdateMilestoneMutation,
    useUpdateMilestoneStatusMutation,
    useUpdateMilestoneBillingStatusMutation,
    useFetchMilestonesQuery,
    useUpdateSignedContractMutation
} = projectApi