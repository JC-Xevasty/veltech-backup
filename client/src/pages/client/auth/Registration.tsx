import { Helmet } from "react-helmet-async"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import _ from "lodash"
import { useCreateUserMutation } from "../../../features/api/user"
import { api } from "../../../config/axios"
import FloatingLabelInputGroup from "../../../components/FloatingLabelInputGroup"
import ColoredTextLogo from "../../../assets/Veltech-Text-Logo-Colored.png"
import type { FieldTypes, MutationResult, User } from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

function Registration() {
  const app = useSelector(selectApp)

  const navigate = useNavigate()

  const [createUserMutation] = useCreateUserMutation()

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<FieldTypes>({
    mode: "onChange"
  })

  const [username, firstName, middleName, lastName, suffix, companyName, emailAddress, contactNumber, password, confirmPassword] = watch(["username", "firstName", "middleName", "lastName", "suffix", "companyName", "emailAddress", "contactNumber", "password", "confirmPassword"])

  const validation = {
    firstName: {
      required: { value: true, message: "First Name is required." },
      minLength: { value: 2, message: "First Name must be at least 2 characters." },
      maxLength: { value: 50, message: "First Name must be at most 50 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){2,50}$/gm, message: "First Name is invalid." }
      // Match: All letters with spaces. 
    },
    middleName: {
      maxLength: { value: 50, message: "Middle Name must be at most 50 characters." },
      pattern: middleName ? { value: /^([a-zA-Zñ\s]){0,50}$/gm, message: "Middle Name is invalid." } : undefined
      // Match: All letters with spaces. 
    },
    lastName: {
      required: { value: true, message: "Last Name is required." },
      minLength: { value: 2, message: "Last Name must be at least 2 characters." },
      maxLength: { value: 50, message: "Last Name must be at most 50 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){2,50}$/gm, message: "Last Name is invalid." }
      // Match: All letters with spaces. 
    },
    suffix: {
      maxLength: { value: 10, message: "Suffix must be at most 10 characters." },
      pattern: suffix ? { value: /^([a-zA-Z][.]?){0,10}$/gm, message: "Suffix is invalid." } : undefined
      // Match: All letters. (possible: Jr., Sr. II, III) 
    },
    companyName: {
      required: { value: true, message: "Company Name is required." },
      minLength: { value: 2, message: "Company Name must be at least 2 characters." },
      maxLength: { value: 255, message: "Company Name must be at most 255 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){3,255}$/gm, message: "Last Name is invalid." }
    },
    username: {
      required: { value: true, message: "Username is required." },
      minLength: { value: 3, message: "Username must be at least 3 characters." },
      maxLength: { value: 15, message: "Username must be at most 15 characters." },
      pattern: { value: /^[a-zA-Z0-9]([a-zA-Z0-9]|[._-](?![._-])){1,13}[a-zA-Z0-9]$/gm, message: "Username is invalid." },
      // Match: Starts and ends with an alphanumeric character. Allows [._-] which isn't followed by another [._-]
      validate: async (username: string) => {
        const res = await api.post("/users/exists/username", { username })
        return !res.data.exists || "Username already exists."
      }
    },
    emailAddress: {
      required: { value: true, message: "E-mail Address is required." },
      minLength: { value: 10, message: "E-mail Address must be at least 10 characters." },
      maxLength: { value: 320, message: "E-mail Address must be at most 320 characters." },
      pattern: { value: /^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/, message: "E-mail Address is invalid." },
      validate: async (emailAddress: string) => {
        const res = await api.post("/users/exists/emailAddress", { emailAddress })
        return !res.data.exists || "E-mail Address already exists."
      }
    },
    contactNumber: {
      required: { value: true, message: "Contact Number is required." },
      minLength: { value: 10, message: "Contact Number must be at least 10 characters." },
      maxLength: { value: 15, message: "Contact Number must be at most 15 characters." },
      pattern: { value: /^((\+63)|0)[\d]{10}$/gm, message: "Contact Number is invalid." },
      validate: async (contactNumber: string) => {
        const res = await api.post("/users/exists/contactNumber", { contactNumber })
        return !res.data.exists || "Contact Number already exists."
      }
    },
    password: {
      required: { value: true, message: "Password is required." },
      minLength: { value: 8, message: "Password must be at least 8 characters." },
      maxLength: { value: 15, message: "Password must be at most 15 characters." },
      pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_])[\w!@#$%^&*-]{8,15}$/gm, message: "Password is invalid." },
      // Match: Atleast one uppercase, lowercase, numbers and special characters [!@#$%^&*-_].
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
      // Match: Atleast one uppercase, lowercase, numbers and special characters [!@#$%^&*-_].
      validate: async (confirmPassword: string) => {
        await trigger("password")
        return confirmPassword === password || "Passwords do not match."
      },
      onChange: _.debounce(async () => {
        await trigger(["password", "confirmPassword"])
      }, 300)
    },
    agree: {
      required: { value: true, message: "You need to agree to the Terms and Conditions." }
    }
  }

  const handleRegister: SubmitHandler<FieldValues> = async (data) => {
    let {
      firstName,
      middleName,
      lastName,
      suffix,
      companyName,
      username,
      emailAddress,
      contactNumber,
      password
    } = data

    const createUser: MutationResult<User> = await createUserMutation({
      firstName,
      middleName: middleName || undefined,
      lastName,
      suffix: suffix || undefined,
      companyName,
      username,
      emailAddress,
      contactNumber,
      password,
      type: "CLIENT"
    })

    if (createUser?.data!.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Created new user {createUser.data.username}!</h1>
        </div>,
        {
          toastId: "register-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      window.scrollTo(0, 0)

      navigate("/verify", {
        replace: true,
        state: {
          emailAddress: createUser.data!.emailAddress
        }
      })
    }

    if (createUser?.data!?.message || createUser?.error) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to create new user!</h1>
        </div>,
        {
          toastId: "register-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  return (
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Registration` }</title>
      </Helmet>

      <div className="grow flex flex-col items-center gap-y-10 w-full py-16 px-10 lg:px-36">
        <img className="object-contain select-none h-[90px]" src={ColoredTextLogo} alt="Veltech Brand" draggable={false} />

        <div className="flex flex-col items-center gap-y-2.5">
          <h1 className="text-5xl text-primary font-grandview-bold">Create an Account.</h1>
          <p className="text-lg text-accent">Start your journey with us by creating your personal account.</p>
        </div>

        <form className="flex flex-col gap-y-7 w-full lg:w-[40%]" onSubmit={handleSubmit(handleRegister)}>
          <FloatingLabelInputGroup
            {...register("username", validation.username)}
            type="text"
            label="Enter your Username *"
            currentValue={username}
            error={errors.username}
            autoComplete="off"
            autoFocus
          />

          <FloatingLabelInputGroup
            {...register("firstName", validation.firstName)}
            type="text"
            label="Enter your First Name *"
            currentValue={firstName}
            error={errors.firstName}
            autoComplete="off"
          />

          <FloatingLabelInputGroup
            { ...register("middleName", validation.middleName) }
            type="text"
            label="Enter your Middle Name"
            currentValue={middleName}
            error={errors.middleName}
            autoComplete="off"
          />

          <FloatingLabelInputGroup
            {...register("lastName", validation.lastName)}
            type="text"
            label="Enter your Last Name *"
            currentValue={lastName}
            error={errors.lastName}
            autoComplete="off"
          />

          <FloatingLabelInputGroup
            {...register("suffix", validation.suffix)}
            type="text"
            label="Enter your Name Suffix"
            currentValue={suffix}
            error={errors.suffix}
            autoComplete="off"
          />

          {/* TODO: @JIMENEZ --- make this optional if possible */} 
          <FloatingLabelInputGroup
            {...register("companyName", validation.companyName)}
            type="text"
            label="Enter your Company Name *"
            currentValue={companyName}
            error={errors.companyName}
            autoComplete="off"
          />

          <FloatingLabelInputGroup
            {...register("emailAddress", validation.emailAddress)}
            type="text"
            label="Enter your E-mail Address *"
            currentValue={emailAddress}
            error={errors.emailAddress}
            autoComplete="off"
          />

          <FloatingLabelInputGroup
            {...register("contactNumber", validation.contactNumber)}
            type="text"
            label="Enter your Contact Number *"
            currentValue={contactNumber}
            error={errors.contactNumber}
            autoComplete="off"
          />

          <span className="text-sm text-accent">(8 Characters minimum, atleast one upper case letter (A-Z), atleast one lower case letter (a-z), atleast one special character) </span>

          <FloatingLabelInputGroup
            {...register("password", validation.password)}
            type="password"
            label="Enter your Password *"
            currentValue={password}
            error={errors.password}
            hideable
            autoComplete="off"
            onPaste={ (evt) => evt.preventDefault() }
          />

          <FloatingLabelInputGroup
            {...register("confirmPassword", validation.confirmPassword)}
            type="password"
            label="Confirm your Password *"
            currentValue={confirmPassword}
            error={errors.confirmPassword}
            hideable
            autoComplete="off"
            onPaste={ (evt) => evt.preventDefault() }
          />

          <div className="flex flex-col items-start gap-y-2 5">
            <div className="flex items-start gap-x-3">
              <input
                {...register("agree", validation.agree)}
                id="agree"
                type="checkbox"
              />

              <label className="text-sm -mt-[0.2rem]" htmlFor="agree">By continuing, I agree to the <span className="text-primary font-grandview-bold">Privacy Policy</span>, default mailer and communications settings governing the use of veltech.com.ph</label>
            </div>

            {errors.agree && <span className="text-sm text-red-700">{errors.agree.message}</span>}
          </div>

          <button
            type="submit"
            className="self-center transition-all ease-in-out duration-300 text-white font-grandview-bold bg-primary hover:scale-105 hover:contrast-[85%] px-16 py-2"
          >
            Register
          </button>
        </form>
      </div>
    </>
  )
}

export default Registration