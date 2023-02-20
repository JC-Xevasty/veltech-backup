import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { faArrowLeftLong, faCheckCircle, faEnvelopeCircleCheck, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { api } from "../../../config/axios"
import { useChangeEmailAddressMutation } from "../../../features/api/user"
import PageError from "../../misc/PageError"
import type { MutationResult, ReduxState, User } from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface FieldTypes {
  emailAddress: string
}

function ChangeEmailAddress() {
  const app = useSelector(selectApp)

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const location = useLocation().state as {
    emailAddress: string | ""
  }

  const navigate = useNavigate()

  const [changeEmailAddressMutation] = useChangeEmailAddressMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<FieldTypes>({
    reValidateMode: "onSubmit"
  })

  const validation = {
    emailAddress: {
      required: { value: true, message: "E-mail Address is required." },
      minLength: { value: 10, message: "E-mail Address must be at least 10 characters." },
      maxLength: { value: 320, message: "E-mail Address must be at most 320 characters." },
      pattern: { value: /^\w+([.-]?\w+)*@([\w+-]+.)+\w{2,3}$/gm, message: "E-mail Address is invalid." },
      validate: async (emailAddress: string) => {
        const res = await api.get(`/users/exists/emailAddress=${ emailAddress }`)
        return !res.data.exists || "E-mail Address already exists."
      }
    }
  }

  const handleChangeEmailAddress: SubmitHandler<FieldTypes> = async (data) => {
    const { emailAddress } = data

    const changeEmailAddress: MutationResult<User> = await changeEmailAddressMutation({
      formerEmailAddress: user ? user.emailAddress : location.emailAddress,
      newEmailAddress: emailAddress
    })

    if (changeEmailAddress?.data?.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully changed e-mail address!</h1>
        </div>,
        {
          toastId: "change-email-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      navigate("/verify", {
        replace: true,
        state: {
          emailAddress: changeEmailAddress.data?.emailAddress
        }
      })
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to change e-mail address!</h1>
        </div>,
        {
          toastId: "change-email-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  return (
    !user && !location?.emailAddress ? <PageError /> :
    <Fragment>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Change E-mail Address` }</title>
      </Helmet>

      <main className="grow flex flex-col justify-center items-center text-accent px-10 lg:px-36 py-10 lg:py-16">
        <div className="relative flex flex-col items-center gap-y-2.5 bg-white drop-shadow-[0_0_5px_#00000033] w-full lg:w-[35%] px-10 py-10">
          <FontAwesomeIcon className="absolute top-0 -translate-y-[60%] text-[#53B45A]" icon={ faEnvelopeCircleCheck } size="5x" fixedWidth />
        
          <Link className="absolute left-3.5 top-2.5 hover:text-primary" to="/verify" onClick={ () => window.scrollTo(0, 0) } state={{ emailAddress: user ? user.emailAddress : location.emailAddress }}>
            <FontAwesomeIcon icon={ faArrowLeftLong } fixedWidth />
          </Link>

          <h1 className="text-lg font-grandview-bold">
            Verify Account E-mail Address.
          </h1>

          <p className="text-sm text-center">
            Change your e-mail address.
          </p>

          <form className="flex flex-col items-center gap-y-2.5 w-full" onSubmit={ handleSubmit(handleChangeEmailAddress) }>
            <input className="text-center rounded border-b-2 border-[#B1C2DE] w-full px-2 py-1 focus-within:outline-none focus-within:border-primary" type="text" { ...register("emailAddress", validation.emailAddress) } autoComplete="off" autoFocus />

            { errors?.emailAddress && <span className="self-start text-sm text-[#FF9494]">{ errors.emailAddress.message }</span> }

            <button className="transition-all ease-in-out duration-300 text-sm text-center text-white rounded bg-primary w-2/3 py-1.5 hover:contrast-[85%]" type="submit">
              Change
            </button>
          </form>
        </div>
      </main>
    </Fragment>
  )
}

export default ChangeEmailAddress