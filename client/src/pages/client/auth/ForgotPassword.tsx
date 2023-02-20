import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate, Link } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { faArrowLeftLong, faCheckCircle, faEnvelope, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { api } from "../../../config/axios"
import { useSendResetMutation } from "../../../features/api/user"
import type { MutationResult, ReduxState, User } from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface FieldTypes {
  emailAddress: string
}

function ForgotPassword() {
  const app = useSelector(selectApp)

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FieldTypes>({
    reValidateMode: "onSubmit"
  })

  const validation = {
    emailAddress: {
      required: {
        value: true,
        message: "E-mail Address is required."
      },
      maxLength: {
        value: 320,
        message: "E-mail Address must not exceed 320 characters."
      },
      pattern: {
        value: /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,8}$/,
        message: "E-mail Address is invalid."
      },
      validate: async (emailAddress: string) => {
        const { data: { exists } } = await api.post(`/users/exists/emailAddress`, {
          emailAddress
        })
        return exists || "E-mail Address is not connected to any account."
      }
    }
  }

  const [resetMutation] = useSendResetMutation()

  const hideEmailAddress: (emailAddress: string) => string = (emailAddress: string) => {
    if (!emailAddress.includes("@")) return ""

    const [identity, domain] = emailAddress.split("@")

    let hidden = ""

    for (let i = 0; i < identity.length; i++) {
      if (i < 3) {
        hidden = hidden.concat(identity.charAt(i))
      } else {
        hidden = hidden.concat("*")
      }

      console.log(hidden)
    }

    return hidden.concat(`@${ domain }`)
  }

  const handleSendResetCode: SubmitHandler<FieldTypes> = async (data) => {
    const emailAddress = user ? user?.emailAddress : data.emailAddress 

    const sendCode: MutationResult<boolean> = await resetMutation({
      emailAddress
    })

    if (sendCode?.data) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Sent code to { emailAddress }!</h1>
        </div>,
        {
          toastId: "send-code-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      navigate("/reset-code", {
        state: {
          emailAddress
        }
      })
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
    <Fragment>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Forgot Password` }</title>
      </Helmet>

      <main className="grow flex justify-center items-center text-accent px-10 lg:px-36 py-10 lg:py-16">
        <div className="relative flex flex-col items-center gap-y-2.5 bg-white drop-shadow-[0_0_5px_#00000033] min-w-full lg:min-w-[33%] px-10 py-10">
          {
            user ?
              <Fragment>
                <Link className="absolute left-3.5 top-2.5 hover:text-primary" to="">
                  <FontAwesomeIcon icon={ faArrowLeftLong } fixedWidth />
                </Link>

                <h1 className="text-lg font-grandview-bold">
                  Reset Password.
                </h1>

                <p className="text-sm text-center">
                  Send reset code to:
                </p>

                <form onSubmit={ handleSubmit(handleSendResetCode) }>
                  <button className="flex items-center gap-x-3 border-2 border-[#B1C2DE] mt-3 px-5 py-1.5" type="submit">
                    <FontAwesomeIcon  className="text-primary" icon={ faEnvelope } fixedWidth />
                    
                    <span>Email { hideEmailAddress(user?.emailAddress) } </span>
                  </button>
                </form>
              </Fragment> 
            :
              <Fragment>
                <Link className="absolute left-3.5 top-2.5 hover:text-primary" to="/login" replace>
                  <FontAwesomeIcon icon={ faArrowLeftLong } fixedWidth />
                </Link>

                <h1 className="text-lg font-grandview-bold">
                  Reset Password
                </h1>

                <p className="text-sm text-center">
                  Enter e-mail address associated with your account.
                </p>

                <form className="flex flex-col items-center gap-y-2.5 w-full" onSubmit={ handleSubmit(handleSendResetCode) }>
                  <div className="group relative w-full">
                    <input className="rounded border-2 border-[#B1C2DE] w-full pl-8 pr-2 py-1 focus-within:outline-none group-focus-within:border-primary" type="email" { ...register("emailAddress", validation.emailAddress) } autoComplete="off" autoFocus />

                    <FontAwesomeIcon className="absolute left-2 top-2.5 text-[#B1C2DE] group-focus-within:text-primary" icon={ faEnvelope } fixedWidth />
                  </div>
                  
                  { errors?.emailAddress && <span className="self-start text-sm text-[#FF9494]">{ errors.emailAddress.message }</span> }

                  <button className="transition-all ease-in-out duration-300 text-sm text-center text-white rounded bg-primary w-2/3 py-1.5 hover:contrast-[85%]" type="submit">
                    Send Reset Code
                  </button>
                </form>
              </Fragment>
          }  
        </div>
      </main>
    </Fragment>
  )
}

export default ForgotPassword