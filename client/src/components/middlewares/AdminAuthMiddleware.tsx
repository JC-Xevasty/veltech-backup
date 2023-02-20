import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import type { LocationState, ReduxState, User } from "../../types"

function AdminAuthMiddleware() {
  const user: User = useSelector((state: ReduxState) => state.auth.user)
  const location = useLocation().state as LocationState
  const adminTypes = ["SUPERADMIN", "ADMIN"]

  return (
    !user || (user && !adminTypes.includes(user.type)) ? <Outlet /> :
      <Navigate to={ location?.from.pathname || "/admin/dashboard" } replace />
  )
}

export default AdminAuthMiddleware