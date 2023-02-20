import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import type { LocationState, ReduxState, User } from "../../types"

function AccountingAuthMiddleware() {
   const user: User = useSelector((state: ReduxState) => state.auth.user)
   const location = useLocation().state as LocationState
   
   return (
      !user || (user && !(user.type === "ACCOUNTING")) ? <Outlet /> :
         <Navigate to={ location?.from.pathname || "/accounting/dashboard" } replace />
   )
}

export default AccountingAuthMiddleware