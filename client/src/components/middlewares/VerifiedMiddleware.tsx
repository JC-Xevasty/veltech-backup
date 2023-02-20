import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { ReduxState, User } from "../../types"

export default function VerifiedMiddleware() {
   const user: User = useSelector((state: ReduxState) => state.auth.user)

   return (
      user && user.isVerified ? <Outlet /> : <Navigate to="/verify" state={{ emailAddress: user.emailAddress }} replace />
   )
}