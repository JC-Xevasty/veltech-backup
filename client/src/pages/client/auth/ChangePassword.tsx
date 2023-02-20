import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import _ from "lodash"
import { faArrowLeftLong, faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useFetchResetQuery, useNullifyResetMutation, useChangePasswordMutation } from "../../../features/api/user"
import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import type { MutationResult, ReduxState, User } from "../../../types"
import TextField from "../../../components/TextField"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface FieldTypes {
  password: string
  confirmPassword: string
}

function ChangePassword() {
  const app = useSelector(selectApp)
  
  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const navigate = useNavigate()

  const location = useLocation().state as {
    emailAddress: string | ""
    resetToken: string | ""
  }

  const { isLoading, isError, data: target } = useFetchResetQuery({
    emailAddress: (user ? user.emailAddress : location?.emailAddress) || ""
  })

  const [nullifyResetMutation] = useNullifyResetMutation()

  const handleNullifyCode = async () => {
    await nullifyResetMutation({
      emailAddress: target?.emailAddress,
      resetToken: target?.resetToken
    })
  }

  const [changePasswordMutation] = useChangePasswordMutation()

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<FieldTypes>({
    reValidateMode: "onSubmit"
  })

  const [password, confirmPassword] = watch(["password", "confirmPassword"])

  const validation = {
    password: {
      required: { value: true, message: "Password is required." },
      minLength: { value: 8, message: "Password must be at least 8 characters." },
      maxLength: { value: 15, message: "Password must be at most 15 characters." },
      pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_])[\w!@#$%^&*-]{8,15}$/gm, message: "Password is invalid." },
      validate: async (password: string) => {
        return password === confirmPassword || "Passwords do not match."
      },
      onChange: _.debounce(async () => {
        await trigger(["password", "confirmPassword"])
      }, 300)
    },
    confirmPassword: {
      required: { value: true, message: "Password Confirmation is required." },
      minLength: { value: 8, message: "Password Confirmation must be at least 8 characters." },
      maxLength: { value: 15, message: "Password Confirmation must be at most 15 characters." },
      pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_])[\w!@#$%^&*-]{8,15}$/gm, message: "Password Confirmation is invalid." },
      validate: async (confirmPassword: string) => {
        await trigger("password")
        return confirmPassword === password || "Passwords do not match."
      },
      onChange: _.debounce(async () => {
        await trigger(["password", "confirmPassword"])
      }, 300)
    }
  }

  const handleChangePassword: SubmitHandler<FieldTypes> = async (data) => {
    const changePassword: MutationResult<boolean> = await changePasswordMutation({
      emailAddress: target?.emailAddress,
      resetToken: target?.resetToken,
      password: data.password
    })

    if (changePassword?.data) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully changed password!</h1>
        </div>,
        {
          toastId: "password-change-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      navigate("/login", {
        replace: true
      })
    }

    if (changePassword?.data!?.message || changePassword?.error) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to change password!</h1>
        </div>,
        {
          toastId: "password-change-failed-toast",
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
        <title>{ `${ app?.appName || "Veltech Inc." } | Change Password` }</title>
      </Helmet>

      <main className="grow flex justify-center items-center text-accent px-10 lg:px-36 py-10 lg:py-16">
        <div className="relative flex flex-col items-center gap-y-2.5 bg-white drop-shadow-[0_0_5px_#00000033] w-full lg:w-2/5 px-10 py-10">
          <Link className="absolute left-3.5 top-2.5 hover:text-primary" to="/forgot-password" replace onClick={ handleNullifyCode }>
            <FontAwesomeIcon icon={ faArrowLeftLong } fixedWidth />
          </Link>

          <h1 className="text-lg font-grandview-bold">
            Change Password
          </h1>

          <p className="text-sm text-center">
            In order to protect your account, make sure your password is:
          </p>

          <div className="flex flex-col items-start gap-y-1">
            {
              [
                "Is not shorter than 8 and not longer than 15 characters.",
                "Is alphanummeric containing lowercase (a-z) and uppercase (A-Z) letters with numbers (0-9) and special characters.",
                "Does not match or significantly contain your username."
              ].map((guide, index) => (
                <div className="flex gap-x-3" key={ `guide-${ index + 1 }` }>
                  <span className="text-primary -mt-1">-</span>
                  <p className="text-sm">{ guide }</p>
                </div>
              ))
            }
          </div>

          <form className="flex flex-col gap-y-3 w-full mt-3" onSubmit={ handleSubmit(handleChangePassword) }>
            <TextField
              { ...register("password", validation.password) }
              type="password"
              label="New Password"
              error={ errors.password }
              hideable
              autoFocus
            />

            <TextField
              { ...register("confirmPassword", validation.confirmPassword) }
              type="password"
              label="Confirm Password"
              error={ errors.confirmPassword }
              hideable
            />

            <button className="self-start transition-all ease-in-out duration-300 text-sm text-white rounded bg-primary py-1.5 px-5 mt-1.5 hover:origin-left hover:scale-105 hover:contrast-[85%]" type="submit">
              Confirm and Change Password
            </button>
          </form>
        </div>
      </main>
    </Fragment>
  )
}

export default ChangePassword