import { Fragment, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightLong, faChevronRight, faUpload, faXmark, faXmarkCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import _ from "lodash"

import { LocationState, MutationResult, Quotation as QuotationType, ReduxState, UploadedFile, User } from "../../types"
import { useCreateQuotationMutation, useQuotationUploadsMutation } from "../../features/api/quotation"
import { useCreateNotificationMutation } from "../../features/api/notification.api"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { selectApp } from "../../features/app/app"

interface FieldValues {
  type: string
  size: string
  width: string
  height: string
  features: string[]
  supplies: string[]
  floorPlan: FileList
  name: string
  company: string
  contactNumber: string
  emailAddress: string
}

function Quotation() {
  const app = useSelector(selectApp)
  
  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const navigate = useNavigate();

  const [selectedModule, setSelectedModule] = useState<string>("installation")

  const [selectedFormSection, setSelectedFormSection] = useState<string>("service")

  const { register, handleSubmit, watch, reset, resetField, setError, formState: { errors } } = useForm<FieldValues>({
    mode: "onChange",
    defaultValues: {
      features: []
    }
  })

  const [createQuotationMutation] = useCreateQuotationMutation();
  const [quotationUploadsMutation] = useQuotationUploadsMutation();

  const [floorPlan] = watch(["floorPlan"])
  const [floorPlans, setFloorPlans] = useState<File[]>([])

  const [size, features] = watch(["size", "features"])

  const validation = {
    size: {
      required: { value: true, message: "Establishment Size is required." },
      pattern: { value: /^(?=.*[1-9])\d*\.?[\d]+$/gm, message: "Establishment Size is invalid. (e.g. 123, 12.345, 200)" },
      validate: {
        greaterThanOne: (size: string) => parseFloat(size) >= 1 || "Establishment Size must be greater than 1.",
      }
    },
    features: {
      required: { value: features.length === 0, message: "Must choose at least one project feature." }
    },
    supplies: {

    },
    floorPlan: {
      required: { value: (floorPlans.length === 0), message: "Floor Plan file must be uploaded." },
      validate: {
        lessThan30MB: (floorPlan: FileList) => floorPlan[0]?.size < 30000000 || "Maximum size allowed is 30MB.",
        // acceptedFormats: (floorPlan: FileList) => ['application/pdf'].includes(floorPlan[0]?.type) || 'Only PNG, JPEG e GIF',
      }
    }
  }

  useEffect(() => {
    const json = JSON.parse(localStorage.getItem('quotationForm')!);
    if (json) {
      reset({
        type: json.type,
        size: json.size,
        features: json.features
      })
      setSelectedModule(json.selectedModule)
    }
    localStorage.removeItem("quotationForm");
    setFloorPlans((floorPlans) => _.filter(floorPlan, (plan) => !_.map(floorPlans, (floorPlan) => floorPlan.name).includes(plan.name)))
  }, [floorPlan, reset])

  const [createNotificationMutation] = useCreateNotificationMutation()

  const handleSubmitQuotation: SubmitHandler<FieldValues> = async (data) => {
    let { type, width, height, features, floorPlan } = data;
    let isUserLoggedIn = false;
    let isFileUploaded = false;
    let floorPlanFilename = "";

    if (user) {
      isUserLoggedIn = true;
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Must be logged in!</h1>
        </div>,
        {
          toastId: "register-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
      window.scrollTo(0, 0)

      localStorage.setItem('quotationForm', JSON.stringify({
        type, width, height, features, floorPlan, selectedModule
      }));

      const location = { from: { pathname: "quotation" } } as LocationState
      navigate("/login", { state: location });
    }


    if (isUserLoggedIn) {
      if (floorPlans.length === 0) {
        setError('floorPlan', { type: 'custom', message: "Floor Plan file must be uploaded" });
      } else {
        let formData = new FormData();
        formData.append('file', floorPlan[0]);

        const quotationUploads: MutationResult<UploadedFile> = await quotationUploadsMutation(formData);

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
        }
      }
    }

    if (isFileUploaded) {
      const createQuotation: MutationResult<QuotationType> = await createQuotationMutation({
        projectType: selectedModule.toUpperCase(),
        buildingType: type.toUpperCase(),
        establishmentSizeWidth: parseFloat(width),
        establishmentSizeHeight: parseFloat(height),
        projectFeatures: [`${ features }`],
        floorPlan: floorPlanFilename,
        userId: user.id
      });

      console.log(createQuotation)

      if (createQuotation?.data!?.id) {
        await createNotificationMutation({
          title: "For Review",
          body: "Requested quotation is now for review.",
          quotationId: createQuotation.data.id,
          origin: "QUOTATION",
          userId: createQuotation.data.userId
        })

        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Quotation requested!</h1>
          </div>,
          {
            toastId: "register-succeded-toast",
            theme: "colored",
            className: "!bg-primary !rounded",
            progressClassName: "!bg-white"
          }
        )

        window.scrollTo(0, 0)

        navigate("/my-quotations", {
          replace: true
        })
      }

      if (createQuotation?.data!?.message || createQuotation?.error) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to request quotation!</h1>
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
        <title>{ `${ app?.appName || "Veltech Inc." } | Quotation` }</title>
      </Helmet>

      <div className="grow text-accent">
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:gap-y-5 bg-[url('./assets/quotation/Banner-Image.png')] bg-cover bg-no-repeat w-full h-[40vh] px-36">
          <h3 className="text-xl text-white font-grandview-bold">Dedicated in providing high quality and affordable services.</h3>

          <h1 className="text-5xl text-white font-grandview-bold leading-[1.15]">Serving the Philippine Industries<br /> for almost 10 years.</h1>
        </div>

        <div className="mx-10 lg:mx-36 my-10 lg:my-20">
          <div className="flex flex-col gap-y-5 w-full lg:w-3/4 mt-10 lg:mt-20">
            <h5 className="text-lg text-primary font-grandview-bold">We offer affordable and high quality services.</h5>

            <h1 className="text-[2.65rem] leading-none font-grandview-bold">Providing High Performance Services for multiple industries and Technologies!</h1>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 mt-10 lg:mt-16">
            <div className="lg:col-start-1 lg:col-end-2">
              <div className="flex flex-col rounded overflow-hidden bg-white drop-shadow-[0_0_5px_#0000001F] w-full lg:w-4/5 mb-10">
                <button className={`transition-all ease-out duration-300 flex justify-between items-center font-grandview-bold px-5 py-2 hover:text-white hover:bg-primary ${selectedModule === "installation" && "text-white bg-primary"}`} type="button" onClick={() => setSelectedModule("installation")}>
                  <span>Installation</span>

                  <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                </button>

                <button className={`transition-all ease-out duration-300 flex justify-between items-center font-grandview-bold px-5 py-2 hover:text-white hover:bg-primary ${selectedModule === "maintenance" && "text-white bg-primary"}`} type="button" onClick={() => setSelectedModule("maintenance")}>
                  <span>Maintenance</span>

                  <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                </button>
              </div>
            </div>

            <div className="lg:col-start-2 lg:col-end-4">
              <div className="flex flex-col gap-y-5 w-full">
                <h1 className="text-5xl font-grandview-bold underline decoration-2">{ selectedModule === "installation" ? "INSTALLATION" : selectedModule === "maintenance" ? "MAINTENANCE" : "SUPPLY" }</h1>

                {
                  selectedModule === "installation" ? (
                    <>
                      <p className="text-lg">Installation services offer various fire protection tools and equipment as a means to further ensure the safety of their people. The sense of responsibility of this company drives us to maximize the quality of work to the satisfaction of its clients.</p>

                      <p className="text-lg">We can provide a full integrated approach to your fire protection, security, personal safety, and product requirements that has a history of quality resources and support from our foreign counterparts for the assurance of 100% implementation of the project.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg">The organization provides maintenance services as an extra kind of support for the installed fire prevention gear and equipment. For the customers to maintain their fire protection supplies and assess its suitability as a working material, the firm examines and monitors the present items to make sure that the following are not damaged or past their expiration dates.</p>

                      <p className="text-lg">We can provide a full integrated approach to your fire protection, security, personal safety, and product requirements that has a history of quality resources and support from our foreign counterparts for the assurance of 100% implementation of the project.</p>
                    </>
                  )
                }
                

                <div className="flex flex-col gap-y-1.5">
                  <span className="text-xl font-grandview-bold">Service Inclusion:</span>
                  
                  {
                    (selectedModule === "installation" || selectedModule === "maintenance") && (
                      [
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
                      ].map((inclusion, index) => (
                        <span className="text-lg" key={`inclusion-${index + 1}`}>{index + 1}. {inclusion}</span>
                      ))
                    )
                  }
                </div>

                <p className="text-lg">This service has its <Link className="text-primary font-grandview-bold hover:underline" to="/terms-and-conditions" onClick={() => window.scrollTo(0, 0)}>Terms and Conditions</Link></p>

                <div className="flex flex-col gap-y-1.5">
                  <h2 className="text-4xl font-grandview-bold underline decoration-2">Request Quote for this Service</h2>

                  <p className="text-lg">We need the following information to give proceed with quotation.</p>
                </div>

                <div className="flex items-center gap-x-5 lg:gap-x-10">
                  <button className={`text-lg font-grandview-bold ${selectedFormSection === "service" && "underline decoration-4 decoration-primary underline-offset-8"}`} type="button" onClick={() => setSelectedFormSection("service")}>
                    Service Information
                  </button>
                </div>

                <form encType="multipart/form-data" onSubmit={handleSubmit(handleSubmitQuotation)}>
                  <div className={`${selectedFormSection === "service" ? "flex flex-col gap-y-7" : "hidden"}`}>
                    <div className="flex flex-col gap-y-3">
                      <span className="text-lg font-grandview-bold">Building Type:</span>

                      <div className="flex items-center gap-x-5">
                        <label className="group hover:cursor-pointer" htmlFor="type-commercial">
                          <input className="peer hidden" id="type-commercial" type="radio" value="commercial" {...register("type")} defaultChecked />

                          <span className="transition-all ease-in-out duration-300 text-[#B1C2DE] font-grandview-bold rounded border-2 border-[#B1C2DE] px-5 py-2 group-hover:text-white group-hover:border-primary group-hover:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:bg-primary">
                            Commercial
                          </span>
                        </label>

                        <label className="group hover:cursor-pointer" htmlFor="type-residential">
                          <input className="peer hidden" id="type-residential" type="radio" value="residential" {...register("type")} />

                          <span className="transition-all ease-in-out duration-300 text-[#B1C2DE] font-grandview-bold rounded border-2 border-[#B1C2DE] px-5 py-2 group-hover:text-white group-hover:border-primary group-hover:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:bg-primary">
                            Residential
                          </span>
                        </label>
                      </div>

                      {errors?.type && <span className="text-sm text-red-700">{errors.type.message}</span>}
                    </div>

                    {
                      (selectedModule === "installation" || selectedModule === "maintenance") && (
                        <Fragment>
                          <div className="flex flex-col gap-y-3">
                            <span className="text-lg font-grandview-bold">Enter Establishment Size in Square meters:</span>

                            <input className="transition-all ease-in-out duration-300 rounded border-2 border-[#B1C2DE] placeholder:text-[#B1C2DE] focus-within:outline-none focus-within:border-primary w-3/5 px-5 py-1" type="text" placeholder="Size in Width" {...register("width", validation.size)} />

                            {errors?.width && <span className="text-sm text-red-700">{errors.width.message}</span>}

                            <input className="transition-all ease-in-out duration-300 rounded border-2 border-[#B1C2DE] placeholder:text-[#B1C2DE] focus-within:outline-none focus-within:border-primary w-3/5 px-5 py-1" type="text" placeholder="Size in Height" {...register("height", validation.size)} />

                            {errors?.height && <span className="text-sm text-red-700">{errors.height.message}</span>}
                          </div>

                          <div className="flex flex-col gap-y-3">
                            <span className="text-lg font-grandview-bold">Feature to be added:</span>

                            <div className="flex flex-col items-start gap-x-5 gap-y-5">
                              {
                                [
                                  { label: "Automatic Fire Sprinkler System", value: "AUFSS" },
                                  { label: "Wet and Dry Fire Hydrant System", value: "WDFHS" },
                                  { label: "Kitchen Hood Fire Suppression System", value: "KHFSS" },
                                  { label: "Carbon Dioxide Fire Suppression System", value: "CDFSS" },
                                  { label: "Flooding System", value: "FS" },
                                  { label: "Fire Detection and Alarm System", value: "FDAS" },
                                  { label: "FM200 System (Include Hydraulic and Flow Calculation)", value: "FM2S" },
                                  { label: "Aragonite Fire Suppression System", value: "ARFSS" },
                                  { label: "Kitchen Hood Fire Protection System", value: "KHFPS" },
                                  { label: "Deluge System", value: "DS" },
                                  { label: "Water Mist System", value: "WMS" },
                                  { label: "Dry Chemical Extinguishing System", value: "DCES" },
                                  { label: "Plumbing System", value: "PS" }
                                ].map((feature, index) => (
                                  <label className="group hover:cursor-pointer" htmlFor={ `feature-${ index + 1 }` }>
                                    <input className="peer hidden" id={ `feature-${ index + 1 }` } type="radio" value={ feature.value } {...register("features", validation.features)} />
    
                                    <span className="transition-all ease-in-out duration-300 text-xs text-[#B1C2DE] font-grandview-bold rounded border-2 border-[#B1C2DE] px-3 py-2 group-hover:text-white group-hover:border-primary group-hover:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:bg-primary">
                                      { feature.label }
                                    </span>
                                  </label>
                                ))
                              }
                            </div>

                            {errors?.features && <span className="text-sm text-red-700">{errors.features.message}</span>}
                          </div>

                          <div className="flex flex-col gap-y-3">
                            <span className="text-lg font-grandview-bold">Updated Floor Plan:</span>

                            <span className="text-[#0B26537F] text-lg font-grandview-bold">Accepted file type: *.doc, *.docx, *.pdf</span>

                            <label className="hover:cursor-pointer" htmlFor="floorPlan">
                              <input className="hidden" type="file" accept=".doc, .docx, .pdf" {...register("floorPlan", validation.floorPlan)} id="floorPlan" />

                              <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full lg:w-3/5 py-5">
                                <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                                <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                              </div>
                            </label>

                            <div className="flex flex-col gap-y-2.5">
                              {
                                floorPlans.map((floorPlan, index) => (
                                  <div className="transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full lg:w-3/5 px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]" key={`floor-plan-${index + 1}`}>
                                    <span className="line-clamp-1 max-w-[50ch]">{floorPlan.name}</span>

                                    <button type="button" onClick={() => { resetField("floorPlan") }}>
                                      <FontAwesomeIcon icon={faXmark} fixedWidth />
                                    </button>
                                  </div>
                                ))
                              }
                            </div>

                            {errors?.floorPlan && <span className="text-sm text-red-700">{errors.floorPlan.message}</span>}

                            <p className="text-[#0B26537F] text-lg font-grandview-bold leading-tight w-full lg:w-3/5">Quotation Requests takes up to 1 to 2 business days of processing. Kindly always check the quotation tab inside your profile to get the latest update.</p>
                          </div>
                        </Fragment>
                      )
                    }
                  </div>

                  <button className="self-start flex items-center gap-x-2.5 rounded text-white bg-accent mt-5 px-3 py-2 hover:scale-105" type="submit">
                    <span className="font-grandview-bold whitespace-nowrap">Request A Quote</span>
                    <FontAwesomeIcon icon={faArrowRightLong} size="lg" fixedWidth />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Quotation