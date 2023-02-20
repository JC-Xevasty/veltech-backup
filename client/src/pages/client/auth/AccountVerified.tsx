import { useCallback, useEffect, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate, useParams } from "react-router-dom"
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useFetchUserQuery, useVerifyAccountMutation } from "../../../features/api/user"
import PageError from "../../misc/PageError"
import { MutationResult } from "../../../types"
import LoadingScreen from "../../misc/LoadingScreen"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

function AccountVerified() {
  const app = useSelector(selectApp)
  
  const navigate = useNavigate()

  const { id, emailAddress, verifyToken } = useParams() as { id: string, emailAddress: string, verifyToken: string }

  const { isError: userError, data: user } = useFetchUserQuery({ id })

  const [verifyAccountMutation] = useVerifyAccountMutation()

  const verifyAccount = useCallback(async () => {
    const verify: MutationResult<boolean> = await verifyAccountMutation({
      emailAddress,
      verifyToken
    })

    if (verify?.data) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully verified account!</h1>
        </div>,
        {
          toastId: "verify-account-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
    
    else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to verify account!</h1>
        </div>,
        {
          toastId: "verify-account-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }, [verifyToken, emailAddress, verifyAccountMutation])

  useEffect(() => {
    if (user && !user?.isVerified) {
      verifyAccount()
    }
  }, [user, verifyAccount])

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && user?.isVerified) {
        navigate("/login", {
          replace: true
        })
      }
    }, 2500)

    return () => {
      clearInterval(interval)
    }
  }, [navigate, user])

  return (
    userError ? <PageError /> :
    user?.emailAddress !== emailAddress ? <LoadingScreen /> :
    <Fragment>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Account Verified` }</title>
      </Helmet>

      <main className="grow flex flex-col justify-center items-center text-accent px-10 lg:px-36 py-10 lg:py-16">
        <div className="relative flex flex-col items-center gap-y-2.5 bg-white drop-shadow-[0_0_5px_#00000033] w-full lg:w-[35%] px-10 py-10">
          <FontAwesomeIcon className="absolute top-0 -translate-y-[60%] text-[#53B45A]" icon={ faCheckCircle } size="4x" fixedWidth />
        
          <h1 className="text-lg font-grandview-bold">
            { user?.isVerified ? "Account successfully verified." : "Verifying account..." }
          </h1>

          <p className="text-sm text-center">
            { user?.isVerified ? "Your account is already verified. You may now proceed to log in." : "Your account is being verified." }
          </p>

          {
            user?.isVerified && (
              <p className="text-sm text-center">You will be redirected to Login in a few moments...</p>
            )
          }          
        </div>
      </main>
    </Fragment>
  )
}

export default AccountVerified