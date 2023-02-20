import { createSlice, CreateSliceOptions } from "@reduxjs/toolkit"

type ApplicationType = {
  id: string
  appName: string | "Veltech Inc."
  companyAddress: string
  companyContactNumber: string
  companyEmailAddress: string
  companyName: string
  faviconPath?: string
  headerPath?: string
  logoPath?: string
}

const sliceOptions: CreateSliceOptions = {
  name: "app",
  initialState: {
    app: null
  },
  reducers: {
    registerApp: (state, action) => { state.app = action.payload.app }
  }
}

const appSlice = createSlice(sliceOptions)

export const {
   registerApp
} = appSlice.actions

export const appReducer = appSlice.reducer

export const selectApp = (state: { app: { app: ApplicationType } }) => state.app.app