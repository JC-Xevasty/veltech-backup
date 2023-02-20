import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import type { ReduxState, User } from "../../types"

function AdminMiddleware() {
  const user: User = useSelector((state: ReduxState) => state.auth.user)
  const location = useLocation()
  const adminTypes = ["SUPERADMIN", "ADMIN"]

  return (
    user && adminTypes.includes(user.type) ? <Outlet /> : <Navigate to="/admin/login" state={{ from: location }} replace />
  )
}

export default AdminMiddleware