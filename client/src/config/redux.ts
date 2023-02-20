import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "../features/api/_base"
import { authReducer } from "../features/auth/auth"
import { appReducer } from "../features/app/app"

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    app: appReducer
  },
  middleware: (defaultMiddleware) => defaultMiddleware()
    .concat(baseApi.middleware)
})