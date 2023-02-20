import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import type { ReduxState, User } from "../../types"

function ClientMiddleware() {
  const user: User = useSelector((state: ReduxState) => state.auth.user)
  const location = useLocation()

  return (
    user ? <Outlet /> :
      <Navigate to="/login" state={ { from: location } } replace />
  )
}

export default ClientMiddleware