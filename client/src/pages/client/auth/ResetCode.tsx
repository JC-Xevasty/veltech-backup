import { useCallback, useEffect, useRef, useState, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { faArrowLeftLong, faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useFetchResetQuery, useSendResetMutation, useNullifyResetMutation } from "../../../features/api/user"
import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import type { MutationResult, ReduxState, User } from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface FieldTypes {
  resetToken: string
}

function ResetCode() {
  const app = useSelector(selectApp)
  
  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const location = useLocation().state as {
    emailAddress: string | ""
  }

  const { isLoading, isError, data: target } = useFetchResetQuery({
    emailAddress: (user ? user.emailAddress : location?.emailAddress) || ""
  })

  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FieldTypes>({
    reValidateMode: "onSubmit"
  })

  const [sendResetMutation] = useSendResetMutation()

  const [nullifyResetMutation] = useNullifyResetMutation()

  const handleNullifyCode = useCallback(async () => {
    await nullifyResetMutation({
      emailAddress: target?.emailAddress,
      resetToken: target?.resetToken
    })
  }, [nullifyResetMutation, target?.emailAddress, target?.resetToken])

  const handleVerifyCode: SubmitHandler<FieldTypes> = async (data) => {
    if (target?.resetToken === data.resetToken) {
      clearInterval(timer.current)
      clearTimeout(expiry.current)

      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Account verified!</h1>
        </div>,
        {
          toastId: "code-verify-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      navigate("/change-password", {
        replace: true,
        state: {
          emailAddress: target?.emailAddress,
          resetToken: target?.resetToken
        }
      })
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to send code!</h1>
        </div>,
        {
          toastId: "code-verify-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  const validation = {
    resetToken: {
      required: {
        value: true,
        message: "You need to enter a valid code."
      },
      minLength: {
        value: 6,
        message: "Code may not be less than 6 characters."
      },
      maxLength: {
        value: 6,
        message: "Code may not be more than 6 characters."
      },
      validate: (value: string) => value === target?.resetToken || "Incorrect verification code."
    }
  }

  const [time, setTime] = useState<number>(300)

  const timer = useRef() as {
    current: ReturnType<typeof setInterval> | number
  }

  const expiry = useRef() as {
    current: ReturnType<typeof setTimeout> | number
  }

  const startTimer = () => {
    timer.current = setInterval(() => {
      setTime((time) => (time > 0) ? time - 1 : time)
    }, 1000)
  }

  const startExpiry = useCallback(() => {
    expiry.current = setTimeout(async () => {
      handleNullifyCode()
    }, 1000 * 300)
  }, [handleNullifyCode])

  const resetTimer = (time: number) => {
    clearInterval(timer.current)
    timer.current = 0
    setTime(time)
  }

  const resetExpiry = () => {
    clearTimeout(expiry.current)
    expiry.current = 0
  }

  useEffect(() => {
    startTimer()
  }, [])

  useEffect(() => {
    startExpiry()
  }, [startExpiry])

  const resendCode = async () => {
    resetTimer(300)
    resetExpiry()

    startTimer()
    startExpiry()

    const sendCode: MutationResult<boolean> = await sendResetMutation({
      emailAddress: user ? user.emailAddress : location.emailAddress
    })

    if (sendCode?.data) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Sent code to { user ? user.emailAddress : location.emailAddress }!</h1>
        </div>,
        {
          toastId: "send-code-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )
    }

    if (sendCode?.data!?.message || sendCode?.error) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to send code!</h1>
        </div>,
        {
          toastId: "send-code-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  return (
    isLoading ? <LoadingScreen /> :
    isError ? <PageError /> :
    !target?.resetToken ? <PageError /> :
    <Fragment>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Reset Code` }</title>
      </Helmet>

      <main className="grow flex flex-col justify-center items-center text-accent px-10 lg:px-36 py-10 lg:py-16">
        <div className="relative flex flex-col items-center gap-y-2.5 bg-white drop-shadow-[0_0_5px_#00000033] w-full lg:w-1/3 px-10 py-10">
          <Link className="absolute left-3.5 top-2.5 hover:text-primary" to="/forgot-password" replace onClick={ handleNullifyCode }>
            <FontAwesomeIcon icon={ faArrowLeftLong } fixedWidth />
          </Link>

          <h1 className="text-lg font-grandview-bold">
            Reset Password
          </h1>

          <p className="text-sm text-center">
            Enter code sent to your e-mail address: <span className="text-primary">{ user ? user.emailAddress : location.emailAddress }</span>
          </p>

          <form className="flex flex-col items-center gap-y-2.5 w-full" onSubmit={ handleSubmit(handleVerifyCode) }>
            <input className="text-center rounded border-b-2 border-[#B1C2DE] w-full px-2 py-1 focus-within:outline-none focus-within:border-primary" type="text" { ...register("resetToken", validation.resetToken) } autoComplete="off" autoFocus />

            { errors?.resetToken && <span className="self-start text-sm text-[#FF9494]">{ errors.resetToken.message }</span> }

            <button className="transition-all ease-in-out duration-300 text-sm text-center text-white rounded bg-primary w-2/3 py-1.5 hover:contrast-[85%]" type="submit">
              Verify Code
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-y-2.5 mt-10">
          <span className="text-sm font-grandview-bold">
            Resend code in { time }
          </span>

          {
            time <= 3 &&
              <span>Didn't receive a code yet?&nbsp;
                <button className="text-primary disabled:text-[#0B2653BB] font-grandview-bold" type="button" disabled={ time > 0 } onClick={ resendCode }>
                  Email again
                </button>
              </span>
          }
        </div>
      </main>
    </Fragment>
  )
}

export default ResetCode