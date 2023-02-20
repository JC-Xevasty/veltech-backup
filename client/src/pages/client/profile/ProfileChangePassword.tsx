import React from 'react'
import { Helmet } from 'react-helmet-async'
import ProfileSidebar from '../../../components/client/ProfileSidebar'
import { useForm, RegisterOptions, SubmitHandler } from "react-hook-form"
import PasswordGroup from '../../../components/accounting/PasswordGroup'
import axios from "axios"
import { MutationResult, ReduxState, User } from '../../../types'
import _ from "lodash"
import { useChangeProfilePasswordMutation } from "../../../features/api/user"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmarkCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface Fields {
  [key: string]: string
}

interface Funnel<T> {
  [key: string]: T
}

function ProfileChangePassword() {
  const app = useSelector(selectApp)

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const { register, handleSubmit, watch, trigger, reset, formState: { errors } } = useForm<Fields>()

  const [password, confirm] = watch(["password", "confirm"])

  const validation: Funnel<RegisterOptions> = {
    current: {
      required: { value: true, message: "Current Password is required." },
      minLength: { value: 8, message: "Current Password must be at least 8 characters." },
      maxLength: { value: 15, message: "Current Password must be at most 15 characters." },
      pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_])[\w!@#$%^&*-]{8,15}$/gm, message: "Current Password is invalid." },
      validate: {
        match: async (value) => {
          const resolve = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/check/password/match`, {
            username: user.username,
            password: value
          })
          return resolve.data.match || "Password not correct."
        }
      }
    },
    password: {
      required: { value: true, message: "New Password is required." },
      minLength: { value: 8, message: "New Password must be at least 8 characters." },
      maxLength: { value: 15, message: "New Password must be at most 15 characters." },
      pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_])[\w!@#$%^&*-]{8,15}$/gm, message: "New Password is invalid." },
      validate: async (password: string) => {
        return password.trim() === confirm.trim() || "Passwords do not match."
      },
      onChange: _.debounce(async () => {
        await trigger(["password", "confirm"])
      }, 300)
    },
    confirm: {
      required: { value: true, message: "Password Confirmation is required." },
      minLength: { value: 8, message: "Password Confirmation must be at least 8 characters." },
      maxLength: { value: 15, message: "Password Confirmation must be at most 15 characters." },
      pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_])[\w!@#$%^&*-]{8,15}$/gm, message: "Password Confirmation is invalid." },
      validate: async (confirm: string) => {
        await trigger("password")
        return confirm.trim() === password.trim() || "Passwords do not match."
      },
      onChange: _.debounce(async () => {
        await trigger(["password", "confirm"])
      }, 300)
    }
  }

    const [changePassword] = useChangeProfilePasswordMutation()

    const handleChangePassword: SubmitHandler<Fields> = async (fields) => {
      const { password } = fields

      const update: MutationResult<User> = await changePassword({
        username: user.username,
        password
      })

      if (update?.data?.id) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Successfully updated password!</h1>
          </div>,
          {
            toastId: "change-password-succeded-toast",
            theme: "colored",
            className: "!bg-primary !rounded",
            progressClassName: "!bg-white"
          }
        )

        reset()
      }

      if (update?.data?.message || update?.error) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to update password!</h1>
          </div>,
          {
            toastId: "change-password-failed-toast",
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
            <title>{ `${ app?.appName || "Veltech Inc." } | Change Password` }</title>
          </Helmet>
          
          <div className="w-100 px-5 lg:px-10 py-10 lg:py-20">
            <div className="lg:grid grid-cols-10 bg-white items-start">
              <div className="lg:col-span-3 col-span-10 px-lg-10 px-5 flex justify-start items-start">
                <div className="items-center gap-x-4 gap-y-10">
                  <ProfileSidebar />
                </div>
              </div>

              <form className='lg:col-span-4 px-5 mt-10 lg:mt-20 flex flex-col gap-y-5 lg:mb-20 lg:items-center' onSubmit={ handleSubmit(handleChangePassword) }>
                <div className='flex flex-row justify-start items-start w-full'>
                    <PasswordGroup
                      { ...register("current", validation.current) }
                      error={ errors.current }
                      id="current"
                      label="Current Password *"
                    />
                </div>

                <div className='flex flex-row justify-start items-start w-full'>
                    <PasswordGroup
                      { ...register("password", validation.password) }
                      error={ errors.password }
                      id="password"
                      label="New Password *"
                    />
                </div>

                <div className='flex flex-row justify-start items-start w-full'>
                    <PasswordGroup
                      { ...register("confirm", validation.confirm) }
                      error={ errors.confirm }
                      id="confirm"
                      label="Confirm Password *"
                    />
                </div>

                <div className='grid lg:grid-cols-3 grid-rows-1 lh:mt-0 mt-3 w-full'>
                    <span></span>
                    <button className="col-span-2 lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-primary px-3 py-1 hover:scale-105" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )
}

export default ProfileChangePassword