import { useEffect } from "react"
import { Helmet } from 'react-helmet-async'
import {useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form';
import ProfileSidebar from '../../../components/client/ProfileSidebar'
import InputGroup from '../../../components/accounting/InputGroup'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { User, MutationResult, UploadedImage } from "../../../types";
import { Link } from 'react-router-dom'
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { useFetchAuthenticatedQuery,useUpdateCurrentMutation,useImageUploadMutation } from "../../../features/api/user"
import LoadingScreen from '../../misc/LoadingScreen'
import PageError from '../../misc/PageError';
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface FieldValues {
  firstName: string,
  middleName: string,
  lastName: string,
  suffix: string,
  username:string,
  emailAddress:string,
  image: FileList,
  type: string,
  contactNumber: string
}

function EditProfile() {
  const app = useSelector(selectApp)

  const navigate = useNavigate()

  const { isLoading: authLoading, isError: authError, data: auth } = useFetchAuthenticatedQuery()

  const [updateCurrentMutation] = useUpdateCurrentMutation()

  const [uploadImageMutation] = useImageUploadMutation()

  const { register, handleSubmit, reset, watch, formState:{errors}} = useForm<FieldValues>();

  const validation = {
    firstName: {
      required: { value: true, message: "First Name is required." },
      minLength: { value: 2, message: "First Name must be at least 2 characters." },
      maxLength: { value: 50, message: "First Name must be at most 50 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){2,50}$/gm, message: "First Name is invalid." }
      // Match: All letters with spaces. 
    },
    middleName: {
      required:false,
      maxLength: { value: 50, message: "Middle Name must be at most 50 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){0,50}$/gm, message: "Middle Name is invalid." } 
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
      required:false,
      maxLength: { value: 10, message: "Suffix must be at most 10 characters." },
      pattern: { value: /^([a-zA-Z][.]?){0,10}$/gm, message: "Suffix is invalid." }
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
    },
    contactNumber: {
      required: { value: true, message: "Contact Number is required." },
      minLength: { value: 10, message: "Contact Number must be at least 10 characters." },
      maxLength: { value: 15, message: "Contact Number must be at most 15 characters." },
      pattern: { value: /^((\+63)|0)[\d]{10}$/gm, message: "Contact Number is invalid." },
    },
  }

  useEffect(() => {
    if (auth) {
      reset({
        firstName: auth.firstName,
        middleName: auth?.middleName,
        lastName: auth.lastName,
        suffix: auth?.suffix,
        type: auth.type,
        username: auth.username,
        contactNumber: auth.contactNumber,
        emailAddress: auth.emailAddress
      })
    }
  }, [reset, auth])

  const handleEdit: SubmitHandler<FieldValues> = async (values) => {
    let imageFileName = ""
    let {
      firstName,
      middleName,
      lastName,
      suffix,
      username,
      emailAddress,
      contactNumber,
      image
    } = values

    if (image?.length) {
      let formData = new FormData();
      formData.append('image', image[0])

      const uploadImage: MutationResult<UploadedImage> = await uploadImageMutation(formData)
      
      if (uploadImage?.data?.fileName) {
        console.log(uploadImage?.data?.fileName)
        imageFileName = uploadImage?.data?.fileName
        console.log(uploadImage?.data?.path)
      } 
    }

    const updateCurrent: MutationResult<User> = await updateCurrentMutation({
      firstName,
      middleName: middleName || undefined,
      lastName,
      suffix: suffix || undefined,
      username,
      emailAddress,
      image: imageFileName || auth?.image
    })


  if (updateCurrent?.data?.id) {
    toast(
      <div className="flex justify-center items-center gap-x-3">
        <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
        <h1 className="text-white font-grandview-bold">Successfully update profile!</h1>
      </div>,
      {
        toastId: "update-user-succeded-toast",
        theme: "colored",
        className: "!bg-primary !rounded",
        progressClassName: "!bg-white"
      }
    )
    navigate("/account")
  } else {
    toast(
      <div className="flex justify-center items-center gap-x-3">
        <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
        <h1 className="text-white font-grandview-bold">Failed to update profile!</h1>
      </div>,
      {
        toastId: "update-user-failed-toast",
        theme: "colored",
        className: "!bg-red-700 !rounded",
        progressClassName: "!bg-white"
      }
    )
  }
}

 
  return (
    authLoading ? <LoadingScreen />:
    authError ? <PageError />:
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Edit Profile` }</title>
      </Helmet>
      
      <div className="w-100 px-5 lg:px-10 py-10 lg:py-20">
        <div className="lg:grid grid-cols-10 bg-white items-start">
          <div className="lg:col-span-3 col-span-10 px-lg-10 px-5 flex justify-start items-start">
            <div className="items-center gap-x-4 gap-y-10">
              <ProfileSidebar />
            </div>
          </div>
          <form className='lg:col-span-6 mt-10 lg:mt-20 lg:mb-20 items-center lg:grid lg:grid-cols-10' onSubmit={handleSubmit(handleEdit)}>
            <div className="flex flex-col mb-10 lg:col-span-7 lg:border-r-2 lg:border-r-gray lg:pr-10 col-span-10 gap-y-4 items-start">
              <div className='lg:w-1/2 w-full'>
                <InputGroup label='Username' id='username' placeholder="Username"{...register("username", validation.username)}/>
                {errors?.username && <span className="text-red-700">{errors.username.message}</span>}
              </div>
              <div className='w-full flex flex-col lg:flex-row gap-x-2 gap-y-4'>
                <InputGroup label='First Name' id='first-name' placeholder="First Name"{...register("firstName", validation.firstName)}/>
                {errors?.firstName && <span className="text-red-700">{errors.firstName.message}</span>}
                <InputGroup label='Middle Name' id='middle-name' placeholder="Middle Name" {...register("middleName", validation.middleName)}/>
                {errors?.middleName && <span className="text-red-700">{errors.middleName.message}</span>}
                <InputGroup label='Last Name' id='last-name' placeholder="Last Name"{...register("lastName", validation.lastName)}/>
                {errors?.lastName && <span className="text-red-700">{errors.lastName.message}</span>}
                <InputGroup label='Suffix' id='suffix' placeholder="Suffix" {...register("suffix", validation.suffix)}/>
                {errors?.suffix && <span className="text-red-700">{errors.suffix.message}</span>}
              </div>
              <div className='lg:w-1/2 w-full'>
                <InputGroup label='Email Address' id='email' disabled placeholder="Email Address" {...register("emailAddress", {required: true, maxLength: 80})}/>
              </div>
              <div className='flex w-full gap-x-5'>
                <Link to="/change-email-address" className='text-[#3073E2] hover:text-primary underline underline-offset-2'>Change Email</Link>
                <Link to="/verify" className='text-[#3073E2] hover:text-primary underline underline-offset-2'>Verify Account</Link>
              </div>
              <button className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-primary px-3 py-1 hover:scale-105" type="submit">Save Changes</button>
            </div>
            <div className="lg:col-span-3 flex flex-col lg:pl-10 gap-y-4 justify-center items-start">
              <img className=" w-[100px] h-[100px] mx-auto rounded-full ring-[5px] ring-gray-300" src ={ watch("image")?.length && watch("image")[0] ? URL.createObjectURL(watch("image")[0]) : auth?.image ? `${process.env.REACT_APP_API_URL}/uploads/${auth.image}` : `${process.env.REACT_APP_API_URL}/assets/user-profile-placeholder.jpg` } alt="" />
              <input type ="file" accept=".png, .jpg" id="image" {...register("image", {required: false, maxLength: 80})}></input>
              <button className="lg:w-3/4 transition-all mx-auto ease-in-out duration-300 text-white tracking-wide rounded bg-primary px-3 py-1 hover:scale-105" type="submit">Save Image</button>
              {/*<button className="lg:w-3/4 transition-all mx-auto ease-in-out duration-300 text-primary tracking-wide rounded border border-primary px-3 py-1 hover:scale-105" type="submit">Delete</button>*/}
              <div className='flex flex-col w-full'>
                <span className='text-sm text-center w-full'>File size: maximum 10 MB</span>
                <span className='text-sm text-center w-full'>File extension: .JPEG, .PNG</span>
              </div>
            </div>
          </form>
        </div>
      </div>
      </>
  )
}

export default EditProfile