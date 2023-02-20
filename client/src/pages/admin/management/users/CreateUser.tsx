import { Helmet } from "react-helmet-async"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import { useNavigate, useOutletContext } from "react-router-dom"
import _ from "lodash"
import InputGroup from "../../../../components/accounting/InputGroup"
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { api } from "../../../../config/axios"
import { useCreateUserMutation } from "../../../../features/api/user"
import type { FieldTypes, MutationResult, OutletContext, User } from "../../../../types"
import HeaderGroup from "../../../../components/HeaderGroup"
import PasswordGroup from "../../../../components/accounting/PasswordGroup"
import SelectGroup from "../../../../components/accounting/SelectGroup"
import { useSelector } from "react-redux"
import { selectApp } from "../../../../features/app/app"
import { selectUser } from "../../../../features/auth/auth"
import { useCreateActivityMutation } from "../../../../features/api/activity.log"

function CreateUser() {
  const app = useSelector(selectApp)

  const auth = useSelector(selectUser)

  const navigate = useNavigate()

  const { offset } = useOutletContext() as OutletContext

  const [createUserMutation] = useCreateUserMutation() 

  const [createActivityMutation] = useCreateActivityMutation();

  const { register, handleSubmit, reset, watch, trigger, formState: { errors } } = useForm<FieldTypes>({
    mode: "onChange"
  })

  const [middleName, suffix, password, confirmPassword] = watch(["middleName", "suffix", "password", "confirmPassword"])

  const validation = {
    firstName: {
      required: { value: true, message: "First Name is required." },
      minLength: { value: 2, message: "First Name must be at least 3 characters." },
      maxLength: { value: 25, message: "First Name must be at most 25 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){2,25}$/gm, message: "First Name is invalid." }
      // Match: All letters with spaces. 
    },
    middleName: {
      maxLength: { value: 25, message: "Middle Name must be at most 25 characters." },
      pattern: middleName ? { value: /^([a-zA-Zñ\s]){0,25}$/gm, message: "Middle Name is invalid." } : undefined
      // Match: All letters with spaces. 
    },
    lastName: {
      required: { value: true, message: "Last Name is required." },
      minLength: { value: 2, message: "Last Name must be at least 3 characters." },
      maxLength: { value: 25, message: "Last Name must be at most 25 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){2,25}$/gm, message: "Last Name is invalid." }
      // Match: All letters with spaces. 
    },
    suffix: {
      maxLength: { value: 10, message: "Suffix must be at most 10 characters." },
      pattern: suffix ? { value: /^([a-zA-Z][.]?){0,10}$/gm, message: "Suffix is invalid." } : undefined
      // Match: All letters. (possible: Jr., Sr. II, III) 
    },
    type: {
      required: { value: true, message: "User Type is required." }
    },
    username: {
      required: { value: true, message: "Username is required." },
      minLength: { value: 3, message: "Username must be at least 3 characters." },
      maxLength: { value: 15, message: "Username must be at most 15 characters." },
      pattern: { value: /^[a-zA-Z0-9]([a-zA-Z0-9]|[._-](?![._-])){1,13}[a-zA-Z0-9]$/gm, message: "Username is invalid." },
      // Match: Starts and ends with an alphanumeric character. Allows [._-] which isn't followed by another [._-]
      validate: async (username: string) => {
        const res = await api.post(`/users/exists/username`, {
          username
        })
        return !res.data.exists || "Username already exists."
      }
    },
    emailAddress: {
      required: { value: true, message: "E-mail Address is required." },
      minLength: { value: 10, message: "E-mail Address must be at least 10 characters." },
      maxLength: { value: 320, message: "E-mail Address must be at most 320 characters." },
      pattern: { value: /^\w+([\.\-]?\w+)*@([\w+\-]+\.)+\w{2,3}$/gm, message: "E-mail Address is invalid." },
      validate: async (emailAddress: string) => {
        const res = await api.post(`/users/exists/emailAddress`, {
          emailAddress
        })
        return !res.data.exists || "E-mail Address already exists."
      }
    },
    contactNumber: {
      required: { value: true, message: "Contact Number is required." },
      minLength: { value: 10, message: "Contact Number must be at least 10 characters." },
      maxLength: { value: 320, message: "Contact Number must be at most 320 characters." },
      pattern: { value: /^(09|\+639)\d{9}$/gm, message: "Contact Number is invalid." },
      validate: async (contactNumber: string) => {
        const res = await api.post(`/users/exists/contactNumber`, {
          contactNumber
        })
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
        return confirmPassword === password || "Passwords do not match."
      },
      onChange: _.debounce(async () => {
        await trigger(["password", "confirmPassword"])
      }, 300)
    }
  }

  const handleCreate: SubmitHandler<FieldValues> = async (values) => {
    let {
      firstName,
      middleName,
      lastName,
      suffix,
      username,
      emailAddress,
      contactNumber,
      password,
      type
    } = values

    const createUser: MutationResult<User> = await createUserMutation({
      firstName,
      middleName: middleName || undefined,
      lastName,
      suffix: suffix || undefined,
      username,
      emailAddress,
      contactNumber,
      password,
      type,
      isVerified: true
    })

    await createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-create-new-user`,
      module: "CREATE-USER",
      category: "CREATE",
      status: (createUser?.data?.id ? "SUCCEEDED" : "FAILED")
    });

    if (createUser?.data?.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully created new user!</h1>
        </div>,
        {
          toastId: "create-user-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      navigate("/admin/management/users", {
        replace: true
      })
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to create new user!</h1>
        </div>,
        {
          toastId: "create-user-failed-toast",
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
        <title>{`${app?.appName || "Veltech Inc."} | Create User`}</title>
      </Helmet>

      <main className={ `${ offset }` }>
        <div className='flex justify-between px-5 items-center'>
          <div className='flex items-center w-full justify-between'>
            <HeaderGroup text="Add User" link="/admin/management/users" />
          </div>
        </div>
        <form autoComplete="new-password" className="flex flex-col gap-y-5 p-5" onSubmit={ handleSubmit(handleCreate) }>
          <p className='text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5'>User Information</p>

          <label className="text-sm text-[#133061] font-grandview-bold">Full Name <span className="text-primary"></span></label>
          <div className="grid grid-cols-4 gap-x-10">
            <InputGroup
              { ...register("firstName", validation.firstName) }
              error={ errors.firstName }
              placeholder="First Name *"
              id="first-name"
            />

            <InputGroup
              { ...register("middleName", validation.middleName) }
              error={ errors.middleName }
              placeholder="Middle Name"
              id="middle-name"
            />

            <InputGroup
              { ...register("lastName", validation.lastName) }
              error={ errors.lastName }
              placeholder="Last Name *"
              id="last-name"
            />

            <InputGroup
              { ...register("suffix", validation.suffix) }
              error={ errors.suffix }
              placeholder="Suffix"
              id="suffix"
            />
          </div>

          <div className="grid grid-cols-3 gap-x-10">
            <SelectGroup id="user-type" options={ ["Type *", "Admin", "Accounting"] } error={ errors.type } values={ ["", "ADMIN", "ACCOUNTING"] } label="User Type:" defaultValue="" { ...register("type", validation.type) } />
          </div>

          <div className="grid grid-cols-3 gap-x-10">
            <InputGroup
              { ...register("contactNumber", validation.contactNumber) }
              error={ errors.contactNumber }
              label="Contact Number"
              id="contact"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-x-10">
            <InputGroup
              { ...register("emailAddress", validation.emailAddress) }
              error={ errors.emailAddress }
              placeholder="E-mail Address *"
              id="email"
              label="Email Address"
            />
             <InputGroup
              { ...register("username", validation.username) }
              error={ errors.username }
              placeholder="Username *"
              id="username"
              label="Username"
            />
          </div>
          <div className="grid grid-cols-3 gap-x-10">
            <PasswordGroup
              { ...register("password", validation.password) }
              error={ errors.password }
              placeholder="Password *"
              id="password"
              label="Password"
            />
            
            <PasswordGroup
              { ...register("confirmPassword", validation.confirmPassword) }
              error={ errors.confirmPassword }
              placeholder="Confirm Password *"
              id="confirm-password"
              label="Confirm Password"
            />
          </div>

          <div className="flex gap-x-5">
            <button className=" w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="submit">Submit</button>
            
            <button onClick={ () => { reset(); navigate("/admin/management/users") } } className=" w-fit transition-all ease-in-out duration-300 text-black tracking-wide rounded-sm bg-[#EBEBEB] px-3 py-1.5 hover:scale-105" type="button">Cancel</button>
          </div>
        </form>
      </main>
    </>
  )
}

export default CreateUser