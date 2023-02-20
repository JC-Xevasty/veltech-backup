import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import type { LocationState, ReduxState, User } from "../../types"

function ClientAuthMiddleware() {
  const user: User = useSelector((state: ReduxState) => state.auth.user)
  const location = useLocation().state as LocationState

  return (
    !user ? <Outlet /> :
      <Navigate to={ location?.from.pathname || "/" } replace />
  )
}

export default ClientAuthMiddleware