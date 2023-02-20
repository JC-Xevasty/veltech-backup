import { faArrowLeftLong, faUpload, faXmark, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet-async'
import { NavLink, useNavigate, useParams, useLocation } from 'react-router-dom'
import InfoGroup from '../../../components/InfoGroup'
import { format, parseISO } from "date-fns"
import { useForm, SubmitHandler } from "react-hook-form"
import { useFetchClientProjectQuery, useSignedContractUploadsMutation, useUpdateSignedContractMutation, useFetchMilestonesQuery } from "../../../features/api/project"
import { useFetchClientPaymentsQuery } from "../../../features/api/payment"
import { useEffect, useState } from "react"
import { Project, User, MutationResult, ReduxState, UploadedFile } from "../../../types"
import { toast } from "react-toastify"
import LoadingScreen from '../../misc/LoadingScreen'
import PageError from '../../misc/PageError'
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { startCase, camelCase } from 'lodash'

const PROJECT_STATUS = {
  NOT_AVAILABLE: {
    value: "Not Available Yet"
  },
  WAITING_CONTRACT: {
    value: "The contract for the project is now on its drafting process. You can check your email and account for updates",
  },
  WAITING_SIGNATURE: {
    value: "Project contract is now available for your signature. Please read the terms and conditions stated on the contract.",
  },
  WAITING_PAYMENT: {
    value: "Your project is set for payment. Kindly upload a clear picture of your proof of payment for easier verification.",
  },
  WAITING_APPROVAL: {
    value: "We have received your payment for the project. Please wait while we verify your payment before proceeding.",
  },
  ONGOING: {
    value: "Your project/milestone is now ongoing. You can always monitor the status of the project at the ‘projects tab’ under your profile.",
  },
  COMPLETED: {
    value: "The project is already completed! Our company would like to express its gratitude for your trust and partnership.",
  },
  ON_HOLD: {
    value: "Project is placed on hold. Reasons regarding the pausing of the project will be coordinated to you by a company representative.",
  },
  TERMINATED: {
    value: "Project is Terminated. Please check your email inbox for any further project termination notices.",
  },
}

const PAYMENT_STATUS = {
  NOT_AVAILABLE: {
    text: "N/A",
  },
  WAITING_PAYMENT: {
    text: "Waiting Payment",
  },
  WAITING_DOWNPAYMENT: {
    text: "You can now pay the down payment for the project",
  },
  PAID_DOWNPAYMENT: {
    text: "We Received your downpayment for the project",
  },
  WAITING_APPROVAL: {
    text: "Waiting for Approva",
  },
  PAID_BILLING: {
    text: "Paid",
  },
  PROGRESS_BILLING: {
    text: "Progress Billing"
  },
  FULLY_PAID: {
    text: "Fully Paid"
  }
}

interface FieldValues {
  signedContractFileName: FileList,
  projectStatus: any
  paymentStatus: string
  projectPrice: string
  projectDownPayment: string

}

function ClientViewProject() {
  const app = useSelector(selectApp)

  const navigate = useNavigate()

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const { id: projectId } = useParams() as { id: string };

  const location = useLocation().state as {
    userId: string | ""
  }

  const { register, reset, watch, resetField, handleSubmit, formState: { errors } } = useForm<FieldValues>()

  const { isLoading, isError, data: currentClientProject } = useFetchClientProjectQuery({ id: projectId, userId: user ? user.id : location.userId })

  const { data: clientProofOfPayment } = useFetchClientPaymentsQuery({ id: user?.id })

  const [totalProjectPrice, setTotalProjectPrice] = useState<{ totalPayment: number, downPayment: number }>({ totalPayment: 0, downPayment: 0 });

  const stringToPrice = (val: number): string => {
    if (!val) return "PHP -"
    return `PHP ${parseFloat(val.toString()).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  }

  const { data: selectedProjectMilestones } = useFetchMilestonesQuery({ projectId: projectId })

  // useEffect(() => {
  //   if (currentClientProject) {
  //     console.log(currentClientProject.paymentStatus)
  //   }
  // }, [currentClientProject])

  const getProjectStatus = (val: string) => {
    if (val === "NOT_AVAILABLE") return PROJECT_STATUS.NOT_AVAILABLE.value;
    if (val === "WAITING_CONTRACT") return PROJECT_STATUS.WAITING_CONTRACT.value;
    if (val === "SET_MILESTONE") return PROJECT_STATUS.WAITING_CONTRACT.value;
    if (val === "WAITING_SIGNATURE") return PROJECT_STATUS.WAITING_SIGNATURE.value;
    if (val === "WAITING_PAYMENT") return PROJECT_STATUS.WAITING_PAYMENT.value;
    if (val === "WAITING_APPROVAL") return PROJECT_STATUS.WAITING_APPROVAL.value;
    if (val === "ONGOING") return PROJECT_STATUS.ONGOING.value;
    if (val === "COMPLETED") return PROJECT_STATUS.COMPLETED.value;
    if (val === "ON_HOLD") return PROJECT_STATUS.ON_HOLD.value;
    if (val === "TERMINTATED") return PROJECT_STATUS.TERMINATED.value;
    return null;
  }

  const getPaymentStatus = (project: string): string => {
    if (project === "NOT_AVAILABLE") return PAYMENT_STATUS.NOT_AVAILABLE.text;
    if (project === "WAITING_APPROVAL") return PAYMENT_STATUS.WAITING_APPROVAL.text;
    if (project === "WAITING_PAYMENT") return PAYMENT_STATUS.WAITING_PAYMENT.text;
    if (project === "WAITING_DOWNPAYMENT") return PAYMENT_STATUS.WAITING_DOWNPAYMENT.text;
    if (project === "PAID_DOWNPAYMENT") return PAYMENT_STATUS.PAID_DOWNPAYMENT.text;
    if (project === "PROGRESS_BILLING") return PAYMENT_STATUS.PROGRESS_BILLING.text;
    if (project === "FULLY_PAID") return PAYMENT_STATUS.FULLY_PAID.text;
    return PAYMENT_STATUS.NOT_AVAILABLE.text;
  }

  useEffect(() => {
    if (currentClientProject) {
      computeTotal(currentClientProject!)
      reset({
        projectStatus: currentClientProject ? getProjectStatus(currentClientProject?.projectStatus) : "",
        paymentStatus: currentClientProject ? getPaymentStatus(currentClientProject?.paymentStatus) : "",
        projectPrice: stringToPrice(totalProjectPrice.totalPayment),
        projectDownPayment: stringToPrice(totalProjectPrice.downPayment)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, currentClientProject])

  const computeTotal = (project: Project) => {
    const materials = project?.quotation.materialsCost ? parseFloat(project.quotation.materialsCost.toString()) : 0;
    const labor = project?.quotation.laborCost ? parseFloat(project.quotation.laborCost.toString()) : 0;
    const rcost = project?.quotation.requirementsCost ? parseFloat(project.quotation.requirementsCost.toString()) : 0;
    const totalPayment = materials + labor + rcost;
    const downPayment = totalPayment / 2;
    // const vat = totalPayment * 0.12;
    // const subtotal = totalPayment - vat;
    setTotalProjectPrice({ totalPayment, downPayment });
  }


  const getProjectFeatures = (project: Project): string => {
    return project.quotation.projectFeatures?.length ? getProjectFeature(project.quotation.projectFeatures[0]) : " "
  }

  const [signedContractUploadsMutation] = useSignedContractUploadsMutation();
  const [updateSignedContractFileName] = useUpdateSignedContractMutation();

  const handleAddSignedContract: SubmitHandler<FieldValues> = async (values) => {
    let uploadedSignedContractFileName = ""
    let {
      signedContractFileName
    } = values

    let formData = new FormData();
    formData.append('file', signedContractFileName[0])

    const uploadSignedContract: MutationResult<UploadedFile> = await signedContractUploadsMutation(formData)
    if (uploadSignedContract?.data?.fileName) {
      uploadedSignedContractFileName = uploadSignedContract?.data?.fileName
    }

    const updateCurrentProject: MutationResult<Project> = await updateSignedContractFileName({
      id: currentClientProject?.id,
      signedContractFileName: uploadedSignedContractFileName
    })

    if (updateCurrentProject?.data?.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully Uploaded Signed Contract!</h1>
        </div>,
        {
          toastId: "update-user-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  const validation = {
    signedContractFileName: {
      required: {
        value: true,
        message: "No File Selected"
      }
    }
  }

  const handleClick = (projectId: string) => {
    window.scrollTo(0, 0);
    navigate(`/my-projects/payment/id=${projectId}`, {
      state: {
        userId: user.id
      }
    })
  }

  const getProjectFeature = (feature: string) => {
    switch (feature) {
      case "AUFSS": return "Automatic Fire Sprinkler System"
      case "WDFHS": return "Wet and Dry Fire Hydrant System"
      case "KHFSS": return "Kitchen Hood Fire Suppression System"
      case "CDFSS": return "Carbon Dioxide Fire Suppression System"
      case "FS": return "Flooding System"
      case "FDAS": return "Fire Detection and Alarm System"
      case "FM2S": return "FM200 System (Include Hydraulic and Flow Calculation)"
      case "ARFSS": return "Aragonite Fire Suppression System"
      case "KHFPS": return "Kitchen Hood Fire Protection System"
      case "DS": return "Deluge System"
      case "WMS": return "Water Mist System"
      case "DCES": return "Dry Chemical Extinguishing System"
      case "PS": return "Plumbing System"
      default: return ""
    }
  }

  const sc = watch("signedContractFileName")

  useEffect(() => {
    console.log(sc)
  }, [sc])

  return (
    isLoading ? <LoadingScreen /> :
      isError ? <PageError /> :
        <>
          <Helmet>
            <title>{ `${ app?.appName || "Veltech Inc." } | View Project #${ currentClientProject?.id.split("-")[0] }` }</title>
          </Helmet>

          <div className="w-100 px-5 lg:px-52 py-10 lg:py-20">
            <div className="flex flex-col">
              <NavLink to="/my-projects" className="flex gap-x-2 items-center hover:text-primary">
                <FontAwesomeIcon icon={faArrowLeftLong} />
                <span>Back</span>
              </NavLink>
              <h1 className="text-4xl font-grandview-bold text-[#133061]">Project #{currentClientProject?.id.split("-")[0]}</h1>
              <div className="flex flex-col lg:flex-row lg:justify-between gap-y-2 w-full lg:items-end border-b border-b-[#B1C2DE] pb-3">
                Created At: {currentClientProject && format(new Date(currentClientProject?.createdAt), "MM-dd-yyyy | hh:mm a")}
                {(() => {
                  if (currentClientProject?.paymentStatus === "WAITING_DOWNPAYMENT" || currentClientProject?.paymentStatus === "PAID_DOWNPAYMENT" || currentClientProject?.paymentStatus === "WAITING_PAYMENT" || currentClientProject?.paymentStatus === "PAID_BILLING") {
                    return (
                      <>
                        <div className="flex flex-col lg:flex-row gap-x-2 gap-y-3">
                          <button onClick={() => handleClick(currentClientProject ? currentClientProject?.id : "")} className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-[#00BDB3] px-3 py-1 hover:scale-105">Add Payment</button>
                        </div>
                      </>
                    )
                  }
                })()}
              </div>
              <div className="flex flex-col lg:flex-row lg:justify-evenly w-full h-fit my-5">
                <div className="flex flex-col gap-y-3 w-full">
                  <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Project Status</p>
                  <label className="font-grandview">{(currentClientProject) ? startCase(camelCase(currentClientProject?.projectStatus)) : ""}</label>
                  <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Project Information</p>
                  <InfoGroup label="Building Type:" value={(currentClientProject) ? currentClientProject.quotation.buildingType : "-"} />
                  <InfoGroup label="Establishment Width:" value={(currentClientProject) ? currentClientProject.quotation.establishmentSizeWidth + "m" : "-"} />
                  <InfoGroup label="Establishment Height:" value={(currentClientProject) ? currentClientProject.quotation.establishmentSizeHeight + "m" : "-"} />
                  <InfoGroup label="Features to be Added:" value={(currentClientProject) ? getProjectFeatures(currentClientProject) : "-"} />
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                  <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Payment Status</p>
                  <label className="font-grandview">{(currentClientProject) ? getPaymentStatus(currentClientProject?.paymentStatus) : ""}</label>
                  <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Project Total Price</p>
                  <label className="font-grandview"> {stringToPrice(totalProjectPrice.totalPayment)}  </label>
                  <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Downpayment Price</p>
                  <label className="font-grandview">{stringToPrice(totalProjectPrice.downPayment)}</label>
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                  {/* TODO: only show if status is waiting signature  */}
                  {(() => {
                    if (((currentClientProject?.projectStatus === "WAITING_SIGNATURE" && currentClientProject?.contractFileName !== "-") || currentClientProject?.contractFileName !== "-") && currentClientProject?.signedContractFileName !== "-") {
                      return <>
                        <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Project Contract</p>
                        <a className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                          href={currentClientProject ? `${process.env.REACT_APP_API_URL}/uploads/${currentClientProject.contractFileName}` : ''}
                          target="blank"
                          rel="noreferrer noopner"
                        > {currentClientProject ? currentClientProject?.contractFileName : "No File Yet"}</a>
                      </>
                    }
                  })()}

                  {/* TODO: only show if status is waiting signature and contract is not yet uploaded */}
                  {(() => {
                    if (currentClientProject?.projectStatus === "WAITING_SIGNATURE" && currentClientProject?.signedContractFileName === "-") {
                      return <>
                        <div className='flex flex-col'>
                          <span className="text-sm">Upload Signed Contract</span>
                          <span className="text-sm">Accepted file type: *.doc, *.docx, *.pdf</span>
                        </div>

                        <form onSubmit={handleSubmit(handleAddSignedContract)}>
                          <label className="hover:cursor-pointer" htmlFor="signedContractFileName">
                            <input className="hidden" type="file" accept=".doc, .docx, .pdf" id="signedContractFileName" {...register("signedContractFileName", validation.signedContractFileName)} />

                            <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full py-5">
                              <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                              <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                            </div>
                            <div className="flex flex-col gap-y-2.5">
                            </div>

                          </label>
                          
                          {
                            sc?.length && sc[0] ? (
                              <div className="flex flex-row justify-start items-center gap-x-3 mt-2 w-full">
                                <div className="grow transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full lg:w-3/5 px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]">
                                  <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[50ch] ">
                                    {watch("signedContractFileName")[0].name}
                                  </span>

                                  <button type="button" className="hover:text-red-600" onClick={() => resetField("signedContractFileName")}>
                                    <FontAwesomeIcon icon={faXmark} size="sm" fixedWidth />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2">
                                {errors.signedContractFileName && <span className="text-red-700 ">{errors.signedContractFileName.message}</span>}
                              </div>
                            )
                          }
                          <button type='submit' className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-[#0B2653] px-3 py-1 mt-3 hover:scale-105">Submit Signed Contract</button>
                        </form>
                      </>
                    }
                    if (currentClientProject?.signedContractFileName !== "-") {
                      return <>
                        <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Signed Project Contract</p>
                        <a className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                          href={currentClientProject ? `${process.env.REACT_APP_API_URL}/uploads/${currentClientProject.signedContractFileName}` : ''}
                          target="blank"
                          rel="noreferrer noopener"
                        >{currentClientProject ? currentClientProject?.signedContractFileName : "No File Yet"}</a>
                      </>
                    }
                  })()}
                </div>
              </div>

              <table className='table border border-x-0 w-full my-5'>
                <thead className="bg-[#0B2653]">
                  <tr>
                    <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>Progress Billing</th>
                    <th className='text-center font-normal text-white text-sm w-1/4 border border-x-1 px-1.5 py-2'>Description</th>
                    <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>Price</th>
                    <th className='text-center font-normal text-white text-sm w-48 border border-x-1 px-1.5 py-2'>Progress Billing Status</th>
                    <th className='text-center font-normal text-white text-sm w-48 border border-x-1 px-1.5 py-2'>Billing Status</th>
                    <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>From</th>
                    <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>To</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    selectedProjectMilestones?.map((milestone, index) => (
                      <tr key={`${ milestone.milestoneNo }-${ index }`}>
                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {`Progress Billing ${milestone.milestoneNo}`}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {milestone.description}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {`PHP ${milestone.price.toLocaleString("en")}`}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {milestone.milestoneStatus}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {milestone.billingStatus}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {format(parseISO(milestone.startDate), "MM-dd-yyyy")}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {format(parseISO(milestone.estimatedEnd), "MM-dd-yyyy")}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <p className='text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5'>Payment Transactions</p>

              <div className='flex flex-col w-full'>
                <div className='flex flex-row justify-evenly w-full py-5'>
                  <p className='font-grandview-bold text-[#0B2653] w-full'>Date and Time</p>
                  <p className='font-grandview-bold text-[#0B2653] w-full'>Description</p>
                  <p className='font-grandview-bold text-[#0B2653] w-full'>Proof of Payment</p>
                </div>
                {
                  clientProofOfPayment?.map((payment, index) => {
                    return <div className='flex flex-row items-center border-b-gray border-b-2 justify-evenly w-full py-5' key={`proof-of-payment-${payment.id}`}>
                      <div className='flex flex-col w-full'>
                        <span>{format(new Date(payment.createdAt), "MMMM dd, yyyy")}</span>
                        <span>{format(new Date(payment.createdAt), "hh:mm a")}</span>
                      </div>
                      <div className='flex flex-col w-full'>
                        <span>
                        {payment.category === 'DOWNPAYMENT' ? 'Downpayment' :
                              payment.category === 'MILESTONE' ? `Progress Billing ${payment.milestoneNo}` : "Others"
                           }
                        </span>
                        <span>Reference No.:  {payment.referenceNo}</span>
                      </div>
                      <a href={`${process.env.REACT_APP_API_URL}/uploads/${payment.imageFileName}`}
                        className='underline w-full text-[#0B2653] hover:text-primary'
                        target="_blank"
                        rel='noreferrer'
                      >View Proof of Payment</a>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </>
  )
}

export default ClientViewProject