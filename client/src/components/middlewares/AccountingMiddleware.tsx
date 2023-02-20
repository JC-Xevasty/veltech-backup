import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import type { ReduxState, User } from "../../types"

function AccountingMiddleware() {
   const user: User = useSelector((state: ReduxState) => state.auth.user)
   const location = useLocation()
   
   return (
      user && user.type === "ACCOUNTING" ? <Outlet /> : <Navigate to="/accounting/login" state={{ from: location }} replace />
   )
}

export default AccountingMiddleware