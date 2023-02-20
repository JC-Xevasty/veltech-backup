import { createSlice, CreateSliceOptions } from "@reduxjs/toolkit"

const sliceOptions: CreateSliceOptions = {
  name: "auth",
  initialState: {
    user: null
  },
  reducers: {
    authenticateUser: (state, action) => { state.user = action.payload.user },
    deauthenticateUser: (state) => { state.user = null }
  }
}

const authSlice = createSlice(sliceOptions)

export const {
  authenticateUser,
  deauthenticateUser
} = authSlice.actions

export const authReducer = authSlice.reducer

export const selectUser = (state: { auth: { user: any } }) => state.auth.user