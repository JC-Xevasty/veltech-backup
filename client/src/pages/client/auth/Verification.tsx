import { useRef, useState, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { faArrowLeftLong, faCheckCircle, faEnvelopeCircleCheck, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useSendVerificationMutation } from "../../../features/api/user"
import PageError from "../../misc/PageError"
import type { MutationResult, ReduxState, User } from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

function Verify() {
  const app = useSelector(selectApp)

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const location = useLocation().state as {
    emailAddress: string | ""
  }

  const navigate = useNavigate()

  const [sendVerification] = useSendVerificationMutation()

  const handleSendVerificationMail = async () => {
    const emailAddress = user ? user.emailAddress : location.emailAddress
    
    const send: MutationResult<boolean> = await sendVerification({
      emailAddress
    })

    if (send?.data) {
      resetTimer(300)
      startTimer()

      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Verification mail sent!</h1>
        </div>,
        {
          toastId: "send-verify-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to send mail!</h1>
        </div>,
        {
          toastId: "send-verify-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  const [time, setTime] = useState<number>(0)

  const timer = useRef() as {
    current: ReturnType<typeof setInterval> | number
  }

  const startTimer = () => {
    timer.current = setInterval(() => {
      setTime((time) => (time > 0) ? time - 1 : time)
    }, 1000)
  }

  const resetTimer = (time: number = 0) => {
    clearInterval(timer.current)
    timer.current = 0

    if (time > 0) {
      setTime(time)
    }
  }

  const handleNavigateChangeEmailAddress = () => {
    resetTimer()

    navigate("/change-email-address", {
      state: {
        emailAddress: user ? user.emailAddress : location.emailAddress
      }
    })
  }

  return (
    !user && !location?.emailAddress ? <PageError /> :
    <Fragment>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Verification` }</title>
      </Helmet>

      <main className="grow flex flex-col justify-center items-center text-accent px-10 lg:px-36 py-10 lg:py-16">
        <div className="relative flex flex-col items-center gap-y-2.5 bg-white drop-shadow-[0_0_5px_#00000033] w-full lg:w-[35%] px-10 py-10">
          <FontAwesomeIcon className="absolute top-0 -translate-y-[60%] text-[#53B45A]" icon={ faEnvelopeCircleCheck } size="5x" fixedWidth />

          <Link className="absolute left-3.5 top-2.5 hover:text-primary" to="/login">
            <FontAwesomeIcon icon={ faArrowLeftLong } fixedWidth />
          </Link>

          <h1 className="text-lg font-grandview-bold">
            Verify Account E-mail Address.
          </h1>

          <p className="text-sm text-center">
            Your account has been recovered.
          </p>

          <p className="text-xs text-center">
            You’ve entered <span className="font-grandview-bold">{ user ? user?.emailAddress : location?.emailAddress }</span> as the email address for your account. Please verify this email address by clicking the button below.
          </p>

          {
            time > 0 ?
              <p className="text-sm mt-5">Resend mail in <span className="font-grandview-bold">{ time } seconds</span>.</p>
            :
              <button className="self-center transition-all ease-in-out duration-300 text-white font-grandview-bold bg-primary hover:scale-105 hover:contrast-[85%] mt-5 px-16 py-2" type="button" disabled={ time > 0 } onClick={ handleSendVerificationMail }>
                Send Verification Mail
              </button>
          }
        </div>

        <span>Didn't receive an e-mail yet?&nbsp;
          <button className="text-primary disabled:text-[#0B2653BB] font-grandview-bold mt-10" type="button" onClick={ handleNavigateChangeEmailAddress }>
            Change E-mail Address
          </button>
        </span>
      </main>
    </Fragment>
  )
}

export default Verify