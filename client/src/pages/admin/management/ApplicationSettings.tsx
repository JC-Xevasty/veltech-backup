import { useEffect, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useOutletContext } from "react-router-dom"
import { SubmitHandler, useForm } from "react-hook-form"
import { faCheckCircle, faUpload, faWarning, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Application, useFetchApplicationQuery, useUpdateApplicationMutation, useUploadApplicationImagesMutation } from "../../../features/api/application.api"
import HeaderGroup from "../../../components/HeaderGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import { MutationResult } from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"
import { useCreateActivityMutation } from "../../../features/api/activity.log"

function ApplicationSettings() {
  
  const [createActivityMutation] = useCreateActivityMutation();

  const { isLoading: applicationLoading, isError: applicationError, data: application } = useFetchApplicationQuery()

  const { offset } = useOutletContext() as { offset: string }

  const app = useSelector(selectApp)

  const auth = useSelector(selectUser)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<Omit<Application, "logoPath" | "faviconPath" | "headerPath"> & { logo: FileList | any, logoPreview: string, favicon: FileList | any, faviconPreview: string, header: FileList | any, headerPreview: string }>({
    mode: "onChange",
    reValidateMode: "onChange"
  })

  useEffect(() => {
    if (application) {
      reset({
        appName: application?.appName,
        companyName: application?.companyName,
        companyAddress: application?.companyAddress,
        companyContactNumber: application?.companyContactNumber,
        companyEmailAddress: application?.companyEmailAddress,
        logoPreview: application?.logoPath,
        faviconPreview: application?.faviconPath,
        headerPreview: application?.headerPath
      })
    }
  }, [application, reset])

  const validation = {
    image: {
      validate: {
        size: (image: FileList) => image?.length ? image[0].size <= 5000000 || "File size may not exceed 5MB." : true
      }
    }
  }

  const [uploadApplicationImagesMutation] = useUploadApplicationImagesMutation()

  const [updateApplicationMutation] = useUpdateApplicationMutation()

  const handleSave: SubmitHandler<Omit<Application, "logoPath" | "faviconPath" | "headerPath"> & { logo: FileList | any, logoPreview: string, favicon: FileList | any, faviconPreview: string, header: FileList | any, headerPreview: string }> = async (values) => {
    let images = new FormData()
    if (values.logo?.length) images.append("logo", values.logo[0])
    if (values.favicon?.length) images.append("favicon", values.favicon[0])
    // images.append("header", values.header[0])

    const uploadApplicationImages: MutationResult<any> = await uploadApplicationImagesMutation(images)

    if (!uploadApplicationImages?.data) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to update application!</h1>
        </div>,
        {
          toastId: "update-app-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
      createActivityMutation({
        userRole: auth.type,
        entry: `${ auth.username }-upload-application-assets`,
        module: "APPLICATION-SETTINGS",
        category: "UPDATE",
        status: "FAILED"
      });

      return
    }

    const uploaded = uploadApplicationImages.data

    const updateApplication: MutationResult<Application> = await updateApplicationMutation({
      id: application!.id,
      appName: values.appName,
      companyName: values.companyName,
      companyAddress: values.companyAddress,
      companyContactNumber: values.companyContactNumber,
      companyEmailAddress: values.companyEmailAddress,
      logoPath: values.logo?.length ? uploaded.logo[0].filename : values.logoPreview,
      faviconPath: values.favicon?.length ? uploaded.favicon[0].filename : values.faviconPreview,
      headerPath: /*values.header.length ? uploaded.header[0].filename : values.headerPreview*/ ""
    })

    if (!updateApplication?.data!.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to update application!</h1>
        </div>,
        {
          toastId: "update-app-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
      createActivityMutation({
        userRole: auth.type,
        entry: `${ auth.username }-update-application`,
        module: "APPLICATION-SETTINGS",
        category: "UPDATE",
        status: "FAILED"
      });
      return
    }

    toast(
      <div className="flex justify-center items-center gap-x-3">
        <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
        <h1 className="text-white font-grandview-bold">Successfully updated application!</h1>
      </div>,
      {
        toastId: "update-app-succeded-toast",
        theme: "colored",
        className: "!bg-primary !rounded",
        progressClassName: "!bg-white"
      }
    )

    createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-update-application`,
      module: "APPLICATION-SETTINGS",
      category: "UPDATE",
      status: "SUCCEEDED"
    });
  }

  const handleReset = () => {
    reset({
      appName: application?.appName,
      companyName: application?.companyName,
      companyAddress: application?.companyAddress,
      companyContactNumber: application?.companyContactNumber,
      companyEmailAddress: application?.companyEmailAddress,
      logo: null,
      logoPreview: application?.logoPath,
      favicon: null,
      faviconPreview: application?.faviconPath,
      header: null,
      headerPreview: application?.headerPath
    })
  }

  return (
    applicationLoading ? <LoadingScreen /> :
      applicationError ? <PageError /> :
        <Fragment>
          <Helmet>
            <title>{`${app?.appName || "Veltech Inc."} | Application Settings`}</title>
          </Helmet>

          <main className={`${offset}`}>
            <div className={`grow w-full h-full p-5`}>
              <HeaderGroup text="Application Settings" />

              <form className="flex flex-col justify-start items-start gap-y-8 py-5 w-full" onSubmit={handleSubmit(handleSave)}>
                <div className="grid grid-cols-3 gap-x-5 w-full">
                  <div className="col-span-1">
                    <div className="flex flex-col justify-start items-start gap-y-3 w-full">
                      <p className="text-accent font-grandview-bold">Upload Company Logo</p>

                      <span className="text-xs">Accepted File Type: .jpg and .png</span>

                      <label className="hover:cursor-pointer w-full" htmlFor="logo">
                        <input className="hidden" type="file" accept=".jpg, .jpeg, .png" {...register("logo", validation.image)} id="logo" />

                        <input className="hidden" type="text" {...register("logoPreview")} defaultValue={application?.logoPath} />

                        <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full py-8">
                          <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                          <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                        </div>
                      </label>

                      {
                        watch("logo")?.length && watch("logo")[0] ? (
                          <div className="flex flex-row justify-start items-center gap-x-3 w-full">
                            <div className="grow flex flex-row justify-between items-center gap-x-3 text-[#444444] rounded-sm bg-[#D9D9D9] px-2.5 py-1">
                              <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[20ch]">
                                {watch("logo")[0].name}
                              </span>

                              <button type="button" className="hover:text-red-600" onClick={() => setValue("logo", undefined)}>
                                <FontAwesomeIcon icon={faXmark} size="sm" fixedWidth />
                              </button>
                            </div>

                            <a className="text-[#007EDA] whitespace-nowrap cursor-pointer" href={URL.createObjectURL(watch("logo")[0])} target="_blank" rel="noreferrer">View Logo</a>
                          </div>
                        ) : watch("logoPreview") ? (
                          <div className="flex flex-row justify-start items-center gap-x-3 w-full">
                            <div className="grow flex flex-row justify-between items-center gap-x-3 text-[#444444] rounded-sm bg-[#D9D9D9] px-2.5 py-1">
                              <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[20ch]">
                                {watch("logoPreview")}
                              </span>

                              <button type="button" className="hover:text-red-600" onClick={() => setValue("logoPreview", "")}>
                                <FontAwesomeIcon icon={faXmark} size="sm" fixedWidth />
                              </button>
                            </div>

                            <a className="text-[#007EDA] whitespace-nowrap cursor-pointer" href={`${process.env.REACT_APP_API_URL}/app/${watch("logoPreview")}`} target="_blank" rel="noreferrer">View Logo</a>
                          </div>
                        ) : (
                          <div className="flex flex-row justify-start items-center gap-x-3 w-full">
                            <span className="grow text-[#444444] rounded-sm bg-[#D9D9D9] whitespace-nowrap text-ellipsis overflow-hidden px-2.5 py-1">
                              No logo image is uploaded.
                            </span>
                          </div>
                        )
                      }

                      {
                        errors?.logo && (
                          <div className="flex flex-row justify-start items-center gap-x-3">
                            <FontAwesomeIcon className="text-xs text-[#DE2B2B]" icon={faWarning} fixedWidth />

                            <span className="text-xs text-[#DE2B2B]">{`${errors.logo.message}`}</span>
                          </div>
                        )
                      }
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="flex flex-col justify-start items-start gap-y-3 w-full">
                      <p className="text-accent font-grandview-bold">Upload Company Favicon</p>

                      <span className="text-xs">Accepted File Type: .jpg and .png</span>

                      <label className="hover:cursor-pointer w-full" htmlFor="favicon2">
                        <input className="hidden" type="file" accept=".jpg, .jpeg, .png" {...register("favicon", validation.image)} id="favicon2" />

                        <input className="hidden" type="text" {...register("faviconPreview")} defaultValue={application?.faviconPath} />

                        <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full py-8">
                          <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                          <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                        </div>
                      </label>

                      {
                        watch("favicon")?.length && watch("favicon")[0] ? (
                          <div className="flex flex-row justify-start items-center gap-x-3 w-full">
                            <div className="grow flex flex-row justify-between items-center gap-x-3 text-[#444444] rounded-sm bg-[#D9D9D9] px-2.5 py-1">
                              <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[20ch]">
                                {watch("favicon")[0].name}
                              </span>

                              <button type="button" className="hover:text-red-600" onClick={() => setValue("favicon", undefined)}>
                                <FontAwesomeIcon icon={faXmark} size="sm" fixedWidth />
                              </button>
                            </div>

                            <a className="text-[#007EDA] whitespace-nowrap cursor-pointer" href={URL.createObjectURL(watch("favicon")[0])} target="_blank" rel="noreferrer">View Favicon</a>
                          </div>
                        ) : watch("faviconPreview") ? (
                          <div className="flex flex-row justify-start items-center gap-x-3 w-full">
                            <div className="grow flex flex-row justify-between items-center gap-x-3 text-[#444444] rounded-sm bg-[#D9D9D9] px-2.5 py-1">
                              <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[20ch]">
                                {watch("faviconPreview")}
                              </span>

                              <button type="button" className="hover:text-red-600" onClick={() => setValue("faviconPreview", "")}>
                                <FontAwesomeIcon icon={faXmark} size="sm" fixedWidth />
                              </button>
                            </div>

                            <a className="text-[#007EDA] whitespace-nowrap cursor-pointer" href={`${process.env.REACT_APP_API_URL}/app/${watch("faviconPreview")}`} target="_blank" rel="noreferrer">View Favicon</a>
                          </div>
                        ) : (
                          <div className="flex flex-row justify-start items-center gap-x-3 w-full">
                            <span className="grow text-[#444444] rounded-sm bg-[#D9D9D9] whitespace-nowrap text-ellipsis overflow-hidden px-2.5 py-1">
                              No favicon image is uploaded.
                            </span>
                          </div>
                        )
                      }

                      {
                        errors?.favicon && (
                          <div className="flex flex-row justify-start items-center gap-x-3">
                            <FontAwesomeIcon className="text-xs text-[#DE2B2B]" icon={faWarning} fixedWidth />

                            <span className="text-xs text-[#DE2B2B]">{`${errors.favicon.message}`}</span>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-5 gap-y-3 w-full">
                  <InputGroup id="app-name" label="Application Name" {...register("appName")} disabled />
                  <InputGroup id="company-name" label="Company Name" {...register("companyName")} />
                  <InputGroup id="company-address" label="Company Address" {...register("companyAddress")} />
                  <InputGroup id="company-contact-number" label="Company Contact Number" {...register("companyContactNumber")} />
                  <InputGroup id="company-email-address" label="Company E-mail Address" {...register("companyEmailAddress")} />
                </div>

                <menu className="self-start flex flex-row justify-start items-center gap-x-5">
                  <button className="transition-all ease-in-out duration-300 text-sm tracking-wide text-white rounded bg-[#00BDB3] px-3 py-2 hover:scale-105" type="submit">
                    Save Changes
                  </button>

                  <button className="transition-all ease-in-out duration-300 text-sm tracking-wide text-[#333333] rounded bg-[#EBEBEB] px-3 py-2 hover:scale-105" type="button" onClick={handleReset}>
                    Reset
                  </button>
                </menu>
              </form>
            </div>
          </main>
        </Fragment>
  )
}

export default ApplicationSettings