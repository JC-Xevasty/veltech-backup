import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { api } from "../../../config/axios"

import HeaderGroup from "../../../components/HeaderGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import SelectGroup from "../../../components/accounting/SelectGroup"
import { useEffect, useState } from "react"
import RadioGroup from "../../../components/RadioGroup"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faUpload, faWarning, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import _ from "lodash"
import { useCreateUserMutation } from "../../../features/api/user"
import { useCreateQuotationMutation, useQuotationUploadsMutation } from "../../../features/api/quotation"
import { useCreateActivityMutation } from "../../../features/api/activity.log"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"

import type { MutationResult, User, Quotation, UploadedFile, Activities } from "../../../types"
import { toast } from "react-toastify"

interface FieldValues {
  status: string
  floorPlan: FileList
  projectType: string
  buildingType: string
  establishmentSizeWidth: string
  establishmentSizeHeight: string
  projectFeatures: string[]
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  companyName: string
  contactNumber: string
  emailAddress: string
  username: string
}

function AccountingQuotations() {
  const app = useSelector(selectApp)
  const auth = useSelector(selectUser)
  const navigate = useNavigate()

  const [createUserMutation] = useCreateUserMutation()

  const [createQuotationMutation] = useCreateQuotationMutation();
  const [createActivityMutation] = useCreateActivityMutation();

  const [quotationUploadsMutation] = useQuotationUploadsMutation();

  const { register, trigger, watch, handleSubmit, resetField, setValue, getValues, setError, formState: { errors } } = useForm<FieldValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      projectFeatures: []
    }
  })

  const [floorPlan] = watch(["floorPlan"])
  const [floorPlans, setFloorPlans] = useState<File[]>([])

  const [projectType, buildingType, projectFeatures, firstName, middleName, lastName, suffix, companyName, contactNumber, emailAddress, username] = watch(["projectType", "buildingType", "projectFeatures", "firstName", "middleName", "lastName", "suffix", "companyName", "contactNumber", "emailAddress", "username"]);

  const validation = {
    projectType: {
      required: { value: true, message: "Project Type is required" },
    },
    buildingType: {
      required: { value: true, message: "Building Type is required" },
    },
    establishmentSize: {
      required: { value: true, message: "Establishment Size is required" },
      pattern: { value: /^(?=.*[1-9])\d*\.?[\d]+$/gm, message: "Establishment Size is invalid. (e.g. 123, 12.345, 200)" },
      validate: {
        greaterThanOne: (size: string) => parseFloat(size) >= 1 || "Establishment Size must be greater than 1",
      }
    },
    features: {
      required: { value: projectFeatures.length === 0, message: "Must choose at least one project feature." }
    },
    floorPlan: {
      required: { value: (floorPlans.length === 0), message: "Floor Plan file must be uploaded" },
      validate: {
        lessThan30MB: (floorPlan: FileList) => floorPlan[0]?.size < 30000000 || "Maximum size allowed is 30MB",
        // acceptedFormats: (floorPlan: FileList) => ['application/pdf'].includes(floorPlan[0]?.type) || 'Only PNG, JPEG e GIF',
      }
    },
    firstName: {
      required: { value: true, message: "First Name is required." },
      minLength: { value: 2, message: "First Name must be at least 2 characters." },
      maxLength: { value: 50, message: "First Name must be at most 50 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){3,50}$/gm, message: "First Name is invalid." }
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
      pattern: { value: /^([a-zA-Zñ\s]){3,50}$/gm, message: "Last Name is invalid." }
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
      pattern: { value: /^([a-zA-Zñ\s]){3,255}$/gm, message: "Company Name is invalid." }
    },
    emailAddress: {
      required: { value: true, message: "E-mail Address is required." },
      minLength: { value: 10, message: "E-mail Address must be at least 10 characters." },
      maxLength: { value: 320, message: "E-mail Address must be at most 320 characters." },
      pattern: { value: /^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/, message: "E-mail Address is invalid." },
      validate: async (emailAddress: string) => {
        const res = await api.post("/users/exists/emailAddress", { emailAddress })
        return !res.data.exists || "E-mail Address already exists."
      },
      onChange: _.debounce(() => handleGenerateUsername(), 300)
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
  }

  const handleGenerateUsername = () => {
    var username = getValues('emailAddress') ? getValues('emailAddress').substring(0, getValues('emailAddress').indexOf('@')) : '';
    setValue('username', username)
    if (username.length !== 0) trigger('username');
  }

  useEffect(() => {
    setFloorPlans((floorPlans) => _.filter(floorPlan, (plan) => !_.map(floorPlans, (floorPlan) => floorPlan.name).includes(plan.name)))
  }, [floorPlan])

  const handleCreate: SubmitHandler<FieldValues> = async (values) => {
    let isUserCreated = false;
    let userId = '';
    let isFileUploaded = false;
    let floorPlanFilename = '';
    let { firstName, middleName, lastName, suffix, companyName, username, emailAddress, contactNumber } = values;
    let { projectType, buildingType, establishmentSizeWidth, establishmentSizeHeight, projectFeatures, floorPlan } = values;

    const createUser: MutationResult<User> = await createUserMutation({
      firstName,
      middleName: middleName || undefined,
      lastName,
      suffix: suffix || undefined,
      companyName,
      username,
      emailAddress,
      contactNumber,
      password: "V3lt3chcl!ent",
      type: "CLIENT"
    })

    await createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-create-client`,
      module: "CREATE-QUOTATION",
      category: "CREATE",
      status: (createUser?.data!.id ? "SUCCEEDED" : "FAILED")
    });

    if (createUser?.data!.id) {
      isUserCreated = true
      userId = createUser.data.id;
    };

    if (createUser?.data!?.message || createUser?.error) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to create user!</h1>
        </div>,
        {
          toastId: "register-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
      createActivityMutation({
        userRole: auth.type,
        entry: `${ auth.username }-create-client`,
        module: "Create Quotation",
        category: "CREATE",
        status: "FAILED"
      });
    }

    if (isUserCreated) {
      if (floorPlans.length === 0) {
        setError('floorPlan', { type: 'custom', message: "Floor Plan file must be uploaded" });
      } else {
        let formData = new FormData();
        formData.append('file', floorPlan[0]);

        const quotationUploads: MutationResult<UploadedFile> = await quotationUploadsMutation(formData);

        await createActivityMutation({
          userRole: auth.type,
          entry: `${ auth.username }-upload-floor-plan`,
          module: "CREATE-QUOTATION",
          category: "CREATE",
          status: (quotationUploads?.data!?.fileName ? "SUCCEEDED" : "FAILED")
        });

        if (quotationUploads?.data!?.fileName) {
          isFileUploaded = true;
          floorPlanFilename = quotationUploads?.data!.fileName;
        } else {
          toast(
            <div className="flex justify-center items-center gap-x-3">
              <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
              <h1 className="text-white font-grandview-bold">Failed to upload floor plan!</h1>
            </div>,
            {
              toastId: "register-failed-toast",
              theme: "colored",
              className: "!bg-red-700 !rounded",
              progressClassName: "!bg-white"
            }
          )
          createActivityMutation({
            userRole: auth.type,
            entry: `${ auth.username }-upload-floor-plan`,
            module: "Create Quotation",
            category: "OTHERS",
            status: "FAILED"
          });
        }
      }
    }

    if (isFileUploaded) {
      const createQuotation: MutationResult<Quotation> = await createQuotationMutation({
        projectType: projectType.toUpperCase(),
        buildingType: buildingType.toUpperCase(),
        establishmentSizeWidth: parseFloat(establishmentSizeWidth),
        establishmentSizeHeight: parseFloat(establishmentSizeHeight),
        projectFeatures: projectFeatures,
        floorPlan: floorPlanFilename,
        userId: userId
      });

      await createActivityMutation({
        userRole: auth.type,
        entry: `${ auth.username }-create-quotation`,
        module: "CREATE-QUOTATION",
        category: "CREATE",
        status: (createQuotation?.data!.id ? "SUCCEEDED" : "FAILED")
      })

      if (createQuotation?.data!?.id) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Quotation created!</h1>
          </div>,
          {
            toastId: "register-succeded-toast",
            theme: "colored",
            className: "!bg-primary !rounded",
            progressClassName: "!bg-white"
          }
        )

        window.scrollTo(0, 0)

        navigate("/accounting/quotations", {
          replace: true
        })
      }

      if (createQuotation?.data!?.message || createQuotation?.error) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to create quotation!</h1>
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
  }

  return (
    <>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | Create Quotation`}</title>
      </Helmet>

      <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
        <HeaderGroup text="Add Quotation" link="/accounting/quotations" />

        <p className='text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5'>Quotation Information</p>

        <form className="flex flex-col gap-y-10 w-full" onSubmit={handleSubmit(handleCreate)}>
          <div className="grid grid-cols-4 justify-start items-start gap-x-10 w-full">

            <InputGroup id="quotation-status" label="Status:" {...register("status")} disabled />

            <SelectGroup
              id="project-type"
              options={["", "Installation", "Maintenance"]}
              values={["", "installation", "maintenance"]}
              label="Project Type:"
              {...register("projectType", validation.projectType)}
              error={errors.projectType}
            />

          </div>

          <div className="flex flex-col gap-y-3">
            <div className="grid grid-cols-4 justify-start items-start gap-x-10 w-full">
              <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Service Information</p>
              <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Attachments</p>
            </div>

            <div className="grid grid-cols-4 justify-start items-start gap-x-10 w-full">

              <div className="flex flex-col gap-y-3">

                <SelectGroup
                  id="building-type"
                  options={["", "Commercial", "Residential"]}
                  values={["", "commercial", "residential"]}
                  label="Building Type:" {
                  ...register("buildingType", validation.buildingType)}
                  error={errors.buildingType}
                />

                <InputGroup
                  id="establishment-size-width"
                  label="Enter Establishment Width in Square Meters:"
                  {...register("establishmentSizeWidth", validation.establishmentSize)}
                  error={errors.establishmentSizeWidth}
                />

                <InputGroup
                  id="establishment-size-height"
                  label="Enter Establishment Height in Square Meters:"
                  {...register("establishmentSizeHeight", validation.establishmentSize)}
                  error={errors.establishmentSizeHeight}
                />

              </div>


              <div className="flex flex-col w-full gap-y-1.5">
                <span className="text-sm font-grandview-bold">Accepted file type: *.doc, *.docx, *.pdf</span>
                <label className="hover:cursor-pointer" htmlFor="floorPlan">
                  <input className="hidden" type="file" accept=".doc, .docx, .pdf" multiple {...register("floorPlan", validation.floorPlan)} id="floorPlan" />

                  <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full py-5">
                    <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                    <span className="text-lg text-[#B1C2DE]">Click here to upload file(s)</span>
                  </div>
                </label>
                {errors?.floorPlan && <span className="text-sm text-red-700">{errors.floorPlan.message}</span>}
                <div className="flex flex-col gap-y-2.5">
                  {
                    floorPlans.map((floorPlan, index) => (
                      <div className="transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]" key={`floor-plan-${index + 1}`}>
                        <span className="line-clamp-1 max-w-[50ch]">{floorPlan.name}</span>

                        <button type="button" onClick={() => { resetField("floorPlan") }}>
                          <FontAwesomeIcon icon={faXmark} fixedWidth />
                        </button>
                      </div>
                    ))
                  }
                </div>
              </div>


            </div>

            <div className="w-full">
              <RadioGroup
                id="features"
                label="Features to be added:"
                options={[
                  "Automatic Fire Sprinkler System",
                  "Wet and Dry Fire Hydrant System",
                  "Kitchen Hood Fire Suppression System",
                  "Carbon Dioxide Fire Suppression System",
                  "Flooding System",
                  "Fire Detection and Alarm System",
                  "FM200 System (Include Hydraulic and Flow Calculation)",
                  "Aragonite Fire Suppression System",
                  "Kitchen Hood Fire Protection System",
                  "Deluge System",
                  "Water Mist System",
                  "Dry Chemical Extinguishing System",
                  "Plumbing System"
                ]}
                values={[
                  "AUFSS",
                  "WDFHS",
                  "KHFSS",
                  "CDFSS",
                  "FS",
                  "FDAS",
                  "FM2S",
                  "ARFSS",
                  "KHFPS",
                  "DS",
                  "WMS",
                  "DCES",
                  "PS"
                ]}
                { ...register("projectFeatures", validation.features) }
              />
            </div>
              {
                errors.projectFeatures && (
                  <div className="flex flex-row justify-start items-center gap-x-3">
                    <FontAwesomeIcon className="text-xs text-[#DE2B2B]" icon={faWarning} fixedWidth />

                    <span className="text-xs text-[#DE2B2B]">{errors.projectFeatures.message}</span>
                  </div>
                )
              }
          </div>


          <div className="flex flex-col gap-y-5">
            <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Client Information</p>

            <div className="grid grid-cols-4 justify-start items-start gap-x-10 w-full">
              <InputGroup id="first-name" label="First Name:" {...register("firstName", validation.firstName)} error={errors.firstName} />
              <InputGroup id="middle-name" label="Middle Name:" {...register("middleName", validation.middleName)} error={errors.middleName} />
              <InputGroup id="last-name" label="Last Name:" {...register("lastName", validation.lastName)} error={errors.lastName} />
              <InputGroup id="suffix-name" label="Suffix:" {...register("suffix", validation.suffix)} error={errors.suffix} />
            </div>

            <div className="grid grid-cols-4 justify-start items-start gap-x-10 w-full">
              <InputGroup id="company-name" label="Company Name:" {...register("companyName", validation.companyName)} error={errors.companyName} />
              <InputGroup id="contact" label="Contact Number:" {...register("contactNumber", validation.contactNumber)} error={errors.contactNumber} />
              <InputGroup id="email" label="Email Address:" {...register("emailAddress", validation.emailAddress)} error={errors.emailAddress} />
              <InputGroup id="username" label="Username:" {...register("username", validation.username)} error={errors.username} />
            </div>

          </div>

          <div className="self-start flex flex-row justify-start items-center gap-x-5">
            <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="submit">Submit</button>

            <button className="transition-all ease-in-out duration-300 text-[#333333] tracking-wide rounded-sm bg-[#EBEBEB] px-3 py-1.5 hover:scale-105" type="submit">Cancel</button>
          </div>

        </form>
      </main>
    </>
  )
}

export default AccountingQuotations