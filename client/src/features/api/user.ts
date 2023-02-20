import { baseApi } from "./_base"
import type { User, Credentials, UploadedImage} from "../../types"

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchUser: build.query<User, Pick<User, "id">>({
      query: ({ id }) => `/users/id=${ id }/fetch`,
      providesTags: ["User"],
      keepUnusedDataFor: 60
    }),

    imageUpload: build.mutation<UploadedImage, FormData>({
      query: (formData) => ({
        url: '/users/upload',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ["Auth"]
   }),

    fetchUsers: build.query<User[], void>({
      query: () => "/users/fetch",
      providesTags: ["Users"],
      keepUnusedDataFor: 150
    }),

    fetchAdmins: build.query<User[], { search: string }>({
      query: ({ search }) => ({
        url: "/users/fetch/admin",
        method: "POST",
        body: {
          search
        }
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 150
    }),

    createUser: build.mutation<User, Partial<User>>({
      query: ({
        firstName, middleName, lastName, suffix, companyName,
        username, emailAddress, contactNumber, password, type, isVerified
      }) => ({
        url: "/users/create",
        method: "POST",
        body: {
          firstName, middleName, lastName, suffix, companyName: companyName ?? null,
          username, emailAddress, contactNumber, password, type, isVerified: isVerified ?? false
        }
      }),
      invalidatesTags: ["Users"]
    }),

    updateUser: build.mutation<User, Partial<User>>({
      query: ({
        firstName, middleName, lastName, suffix,
        username, emailAddress, contactNumber, type, id
      }) => ({
        url: `/users/id=${ id }/update`,
        method: "PATCH",
        body: {
          firstName, middleName, lastName, suffix,
          username, emailAddress, contactNumber, type
        }
      }),
      invalidatesTags: ["User", "Users"]
    }),

    updateUserPassword: build.mutation<User, Partial<User>>({
      query: ({
        password, id
      }) => ({
        url: `/users/id=${ id }/update/password`,
        method: "PATCH",
        body: {
          password
        }
      }),
      invalidatesTags: ["User", "Users"]
    }),

    updateUserStatus: build.mutation<User, Partial<User>>({
      query: ({
        status, id
      }) => ({
        url: `/users/id=${ id }/update/status`,
        method: "PATCH",
        body: {
          status
        }
      }),
      invalidatesTags: ["User", "Users"]
    }),

    fetchAuthenticated: build.query<User, void>({
      query: () => `/users/authenticated/fetch`,
      providesTags: ["Auth"],
      keepUnusedDataFor: 60
    }),
    ////
    updateCurrent: build.mutation<User, Partial<User>>({
      query: ({
        firstName, middleName, lastName, suffix,
        username,image
      }) => ({
        url: `/users/update/current`,
        method: "PATCH",
        body: {
          firstName, middleName, lastName, suffix,
          username,image
        }
      }),
      invalidatesTags: ["Auth"]
    }),

    verifyAccount: build.mutation<boolean, Pick<User, "emailAddress" | "verifyToken">>({
      query: ({ emailAddress, verifyToken }) => ({
        url: `/users/verify`,
        method: "POST",
        body: {
          emailAddress,
          verifyToken
        }
      }),
      invalidatesTags: ["User", "Users", "Auth", "VerifyToken"]
    }),
    
    sendVerification: build.mutation<boolean, Pick<User, "emailAddress">>({
      query: ({ emailAddress }) => ({
        url: "/users/verify/send",
        method: "POST",
        body: {
          emailAddress
        }
      }),
      invalidatesTags: ["VerifyToken"]
    }),

    changeEmailAddress: build.mutation<User, { formerEmailAddress: string, newEmailAddress: string }>({
      query: ({ formerEmailAddress, newEmailAddress }) => ({
        url: `/users/verify/email-address/change`,
        method: "POST",
        body: {
          formerEmailAddress,
          newEmailAddress
        }
      }),
      invalidatesTags: ["User", "Users", "Auth", "VerifyToken"]
    }),

    fetchReset: build.query<Pick<User, "id" | "emailAddress" | "resetToken">, Pick<User, "emailAddress">>({
      query: ({ emailAddress }) => `/users/reset/code/emailAddress=${ emailAddress }/fetch`,
      providesTags: ["ResetToken"],
      keepUnusedDataFor: 300
    }),

    sendReset: build.mutation<boolean, Pick<User, "emailAddress">>({
      query: ({ emailAddress }) => ({
        url: "/users/reset/send",
        method: "PATCH",
        body: {
          emailAddress
        }
      }),
      invalidatesTags: ["User", "Users", "Auth", "ResetToken"]
    }),

    nullifyReset: build.mutation<boolean, Partial<User>>({
      query: ({ emailAddress, resetToken }) => ({
        url: "/users/reset/nullify",
        method: "PATCH",
        body: {
          emailAddress,
          resetToken
        }
      }),
      invalidatesTags: ["User", "Users", "Auth", "ResetToken"]
    }),

    changePassword: build.mutation<boolean, (Partial<User> & { password: string })>({
      query: ({ emailAddress, resetToken, password }) => ({
        url: "/users/reset/password/change",
        method: "PATCH",
        body: {
          emailAddress,
          resetToken,
          password
        }
      }),
      invalidatesTags: ["User", "Users", "Auth", "ResetToken"]
    }),

    authenticateClient: build.mutation<User, Credentials>({
      query: ({
        identity, password
      }) => ({
        url: "/users/authenticate/client",
        method: "POST",
        body: {
          identity, password
        }
      }),
      invalidatesTags: ["Auth"]
    }),

    authenticateAdmin: build.mutation<User, Credentials>({
      query: ({
        identity, password
      }) => ({
        url: "/users/authenticate/admin",
        method: "POST",
        body: {
          identity, password
        }
      }),
      invalidatesTags: ["Auth"]
    }),

    authenticateAccounting: build.mutation<User, Credentials>({
      query: ({
        identity, password
      }) => ({
        url: "/users/authenticate/accounting",
        method: "POST",
        body: {
          identity, password
        }
      }),
      invalidatesTags: ["Auth"]
    }),

    deauthenticateUser: build.mutation<string, void>({
      query: () => ({
        url: "/users/deauthenticate",
        method: "DELETE"
      }),
      invalidatesTags: ["Auth"]
    }),

    changeProfilePassword: build.mutation<User, Pick<User, "username" | "password">>({
      query: (data) => ({
        url: "/users/update/profile/password",
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Auth", "User"]
    })
  })
})

export const {
  useFetchUserQuery,
  useFetchUsersQuery,
  useFetchAdminsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserStatusMutation,
  useSendVerificationMutation,
  useVerifyAccountMutation,
  useChangeEmailAddressMutation,
  useFetchResetQuery,
  useSendResetMutation,
  useNullifyResetMutation,
  useChangePasswordMutation,
  useFetchAuthenticatedQuery,
  useUpdateCurrentMutation,
  useImageUploadMutation,
  useAuthenticateClientMutation,
  useAuthenticateAdminMutation,
  useAuthenticateAccountingMutation,
  useDeauthenticateUserMutation,
  useChangeProfilePasswordMutation
} = userApi