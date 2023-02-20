import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { faSignIn, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch } from "react-redux"
import { useAuthenticateClientMutation } from "../../../features/api/user"
import { authenticateUser } from "../../../features/auth/auth"
import type { FieldTypes, LocationState, MutationResult, User } from "../../../types"
import FloatingLabelInputGroup from "../../../components/FloatingLabelInputGroup"
import ButtonSolid from "../../../components/ButtonSolid"
import ColoredTextLogo from "../../../assets/Veltech-Text-Logo-Colored.png"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

function Login() {
  const app = useSelector(selectApp)

  const [failMessage, setFailMessage] = useState<string>()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation().state as LocationState

  const [authenticateClientMutation] = useAuthenticateClientMutation()

  const { register, handleSubmit, reset, getValues, watch, formState: { errors } } = useForm<FieldTypes>()

  const [identity, password] = watch(["identity", "password"])

  const validation = {
    identity: {
      required: { value: true, message: "Username or E-mail Address is required." }
    },
    password: {
      required: { value: true, message: "Password is required." }
    }
  }

  const handleLogIn: SubmitHandler<FieldValues> = async (data) => {
    const {
      identity,
      password
    } = data

    const authenticateClient: MutationResult<User> = await authenticateClientMutation({
      identity,
      password
    })

    if (authenticateClient?.data!.id) {
      if (authenticateClient.data!.isVerified) {
        navigate(location?.from!.pathname || "/", {
          replace: true
        })
        
        dispatch(authenticateUser({ user: authenticateClient.data }))

        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={ faSignIn } size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">User { authenticateClient.data?.username } logged in!</h1>
          </div>,
          {
            toastId: "log-in-succeded-toast",
            theme: "colored",
            className: "!bg-primary !rounded",
            progressClassName: "!bg-white"
          }
        )
      } else {
        navigate("/verify", {
          replace: true,
          state: {
            emailAddress: authenticateClient.data!.emailAddress
          }
        })
      }
    }

    if (authenticateClient?.data!?.message || authenticateClient?.error) {
      setFailMessage(authenticateClient.data!.message || "Unable to log in user.")
      setTimeout(() => setFailMessage(""), 2500)

      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to log in!</h1>
        </div>,
        {
          toastId: "log-in-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )

      reset({
        identity: getValues("identity"),
        password: ""
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Login` }</title>
      </Helmet>

      <div className="bg-[url('./assets/Background.png')] bg-no-repeat bg-cover px-10 lg:px-36 py-16">
        <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-x-10">
          <div className="lg:col-span-1 w-full">
            <form className="flex flex-col gap-y-5 rounded bg-white drop-shadow-[0_0_5px_#00000033] w-full lg:w-[400px] px-10 py-14" onSubmit={ handleSubmit(handleLogIn) }>
              <h1 className="text-primary text-5xl text-center font-grandview-bold whitespace-nowrap">Welcome Back!</h1>

              <FloatingLabelInputGroup
                { ...register("identity", validation.identity) }
                type="text"
                currentValue={ identity }
                label="Username or E-mail Address"
                error={ errors.identity }
                autoFocus
              />

              <FloatingLabelInputGroup
                { ...register("password", validation.password) }
                type="text"
                currentValue={ password }
                label="Password"
                error={ errors.password }
                hideable
              />

              {
                failMessage && <span className="self-start text-sm text-red-500">{ failMessage }</span>
              }

              <Link className="self-end hover:text-primary" to="/forgot-password">Forgot Password?</Link>

              <ButtonSolid
                type="submit"
                text="Sign In"
                textColorClassName="text-white"
                backgroundColorClassName="bg-primary"
                widthClassName="w-full"
              />
            </form>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-y-8">
            <img className="select-none" src={ app?.logoPath ? `${process.env.REACT_APP_API_URL}/app/${ app.logoPath }` : `${process.env.REACT_APP_API_URL}/assets/logo.png` } alt="Veltech Brand" draggable={ false } />

            <div className="border-l-8 border-l-primary pl-5">
              <p className="text-4xl select-none"><span className="font-grandview-bold">THE SUPREME PROVIDER</span> OF SECURITY AND SAFETY SOLUTIONS IN THE PHILIPPINES.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login