import { faUpload,faXmark,faXmarkCircle,faCheckCircle, faCheck, faMoneyBill, faPause, faCancel, faCheckDouble, faPlay} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useForm, SubmitHandler} from "react-hook-form"
import { useOutletContext, useParams} from "react-router-dom"
import InputGroup from "../../../components/accounting/InputGroup"
import HeaderGroup from "../../../components/HeaderGroup"
import InfoGroup from "../../../components/InfoGroup"
import type { OutletContext , Project as ProjectType, User, MutationResult, UploadedFile, ProjectMilestone} from "../../../types"
import { format, parseISO } from "date-fns"
import { toast } from "react-toastify"
import Modal from "../../../components/Modal"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"

import { useFetchProjectQuery, useContractUploadsMutation, useSetProjectStatusMutation, useSetPaymentStatusMutation,useUpdateContractMutation, useFetchMilestonesQuery, useUpdateMilestoneStatusMutation, useUpdateMilestoneBillingStatusMutation } from "../../../features/api/project"
import TableAction from "../../../components/TableAction"
import { useCreateNotificationMutation } from "../../../features/api/notification.api"
import { useCreateActivityMutation } from "../../../features/api/activity.log"

interface FieldValues {
  paymentStatus:string,
  projectStatus: string,
  contractFileName: FileList,
  projectPrice: string,
  projectDownPayment:string
  remainingBalance: string
}

const MILESTONE_STATUS = {
  NOT_AVAILABLE: {
    text: "N/A",
  },
  ONGOING: {
    text: "Ongoing",
  },
  DONE: {
    text: "Done",
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
    text: "Waiting Down Payment",
  },
  WAITING_APPROVAL: {
    text: "Waiting Approval",
  },
  PAID_BILLING: {
    text: "Paid",
  },
  PAID_DOWNPAYMENT: {
    text: "Paid Down Payment",
  },
  PROGRESS_BILLING: {
    text: "Progress Billing"
  },
  FULLY_PAID:{
    text: "Fully Paid"
  }
}

const PROJECT_STATUS = {
  NOT_AVAILABLE: "N/A",
  WAITING_CONTRACT: "Waiting Contract",
  WAITING_SIGNATURE: "Waiting Client Signature",
  WAITING_PAYMENT:"Waiting Payment",
  WAITING_APPROVAL:"Waiting Approval",
  SET_MILESTONE:"Set Milestone",
  ONGOING:"On Going",
  COMPLETED:"Completed",
  ON_HOLD:"On Hold",
  TERMINATED:"Terminated"
}

function ViewProject() {
  const app = useSelector(selectApp)

  const auth = useSelector(selectUser)

  const [createNotificationMutation] = useCreateNotificationMutation()

  const { offset } = useOutletContext() as OutletContext

  const {id: projectId} = useParams() as {id:string}

  const {isLoading, isError, data: selectedProject} = useFetchProjectQuery({id:projectId})

  const [totalProjectPrice,setTotalProjectPrice] =useState<{ totalPayment: number, downPayment: number}>({ totalPayment: 0, downPayment: 0});

  const [setProjectStatusMutation] = useSetProjectStatusMutation();

  const [setPaymentStatusMutation] =useSetPaymentStatusMutation();

  const [contractUploadsMutation] = useContractUploadsMutation();

  const [updateContractFileName] = useUpdateContractMutation();
  
  const [createActivityMutation] = useCreateActivityMutation();

  const { register, reset,watch, handleSubmit, resetField, formState: { errors } } = useForm<FieldValues>()

  const {data: selectedProjectMilestones} = useFetchMilestonesQuery({projectId: projectId})

  useEffect(()=>{
    if(selectedProject){
      computeTotal(selectedProject);
    }
  }, [selectedProject,selectedProjectMilestones])

  useEffect(() => {
    reset({
      paymentStatus: selectedProject ? getPaymentStatus(selectedProject?.paymentStatus ) : "",
      projectStatus: selectedProject ? getProjectStatus(selectedProject?.projectStatus ) : "",
      projectPrice: stringToPrice(totalProjectPrice.totalPayment),
      projectDownPayment: stringToPrice(totalProjectPrice.downPayment),
      remainingBalance: selectedProject ? stringToPrice(selectedProject.remainingBalance) : "PHP 0.00"
    })
 }, [reset,totalProjectPrice, selectedProject])

  const getProjectStatus = (project: string): string => {
    if (project === 'NOT_AVAILABLE') return PROJECT_STATUS.NOT_AVAILABLE;
    if (project === 'WAITING_CONTRACT') return PROJECT_STATUS.WAITING_CONTRACT;
    if (project === "WAITING_SIGNATURE") return PROJECT_STATUS.WAITING_SIGNATURE;
    if (project === 'WAITING_PAYMENT') return PROJECT_STATUS.WAITING_PAYMENT;
    if (project === 'WAITING_APPROVAL') return PROJECT_STATUS.WAITING_APPROVAL;
    if (project === 'SET_MILESTONE') return PROJECT_STATUS.SET_MILESTONE;
    if (project === 'ONGOING') return PROJECT_STATUS.ONGOING;
    if (project === 'COMPLETED') return PROJECT_STATUS.COMPLETED;
    if (project === 'ON_HOLD') return PROJECT_STATUS.ON_HOLD;
    if (project === 'TERMINATED') return PROJECT_STATUS.TERMINATED;
    return "N/A"
}

const getPaymentStatus = (project:string ): string =>{
  if (project === "NOT_AVAILABLE") return PAYMENT_STATUS.NOT_AVAILABLE.text;
  if (project === "WAITING_APPROVAL") return PAYMENT_STATUS.WAITING_APPROVAL.text;
  if (project === "WAITING_PAYMENT") return PAYMENT_STATUS.WAITING_PAYMENT.text;
  if (project === "PAID_DOWNPAYMENT") return PAYMENT_STATUS.PAID_DOWNPAYMENT.text;
  if (project === "WAITING_DOWNPAYMENT") return PAYMENT_STATUS.WAITING_DOWNPAYMENT.text;
  if (project === "PROGRESS_BILLING") return PAYMENT_STATUS.PROGRESS_BILLING.text;
  if (project === "FULLY_PAID") return PAYMENT_STATUS.FULLY_PAID.text;
  return PAYMENT_STATUS.NOT_AVAILABLE.text;
}

const computeTotal = (project: ProjectType) => {
  const materials = project?.quotation.materialsCost ? parseFloat(project.quotation.materialsCost.toString()) : 0;
  const labor = project?.quotation.laborCost ? parseFloat(project.quotation.laborCost.toString()) : 0;
  const rcost = project?.quotation.requirementsCost ? parseFloat(project.quotation.requirementsCost.toString()): 0;
  const totalPayment = materials + labor + rcost;
  const downPayment = totalPayment / 2;
  const vat = totalPayment * 0.12;
  const subtotal = totalPayment - vat;
  setTotalProjectPrice({totalPayment, downPayment});
}

const stringToPrice = (val: number): string => {
  if (!val) return "PHP -"
  return `PHP ${parseFloat(val.toString()).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

const getClientName = (user: User): string => {
  if (user) {
      let clientName = user.firstName
      clientName = clientName + ((user.middleName) ? ` ${user.middleName} ` : " ")
      clientName = clientName + " " + user.lastName
      return clientName
  }
  return "-"
}

const handleProjectSetStatus = async (status: string) => {
  const setProjectStatus: MutationResult<ProjectType> = await setProjectStatusMutation({
      id: selectedProject?.id,
      projectStatus: status
  })

  await createActivityMutation({
    userRole: auth.type,
    entry: `${ auth.username }-set-project-status-${ status }`,
    module: "VIEW-PROJECT",
    category: "UDATE",
    status: (setProjectStatus?.data!?.id ? "SUCCEEDED" : "FAILED")
  });

  if (setProjectStatus?.data!?.id) {
    switch (status) {
      case "SET_MILESTONE": {
        await createNotificationMutation({
          title: "Set Project Milestone",
          body: "Setting milestone for the project is currently on process.",
          projectId: setProjectStatus.data.id,
          origin: "PROJECT",
          userId: setProjectStatus.data.userId
        })

        break
      }

      case "WAITING_SIGNATURE": {
        await createNotificationMutation({
          title: "Waiting Signature",
          body: "Project contract is now available for your signature.\nPlease read the terms and conditions stated on the contract.",
          projectId: setProjectStatus.data.id,
          origin: "PROJECT",
          userId: setProjectStatus.data.userId
        })

        break
      }

      case "WAITING_PAYMENT": {
        await createNotificationMutation({
          title: "Waiting for Down Payment",
          body: "You can now pay the down payment of the project.\nPlease upload the proof of payment afterwards for verification purposes.",
          projectId: setProjectStatus.data.id,
          origin: "PROJECT",
          userId: setProjectStatus.data.userId
        })

        break
      }

      case "ON_HOLD": {
        await createNotificationMutation({
          title: "On Hold",
          body: "The project is placed on hold.\nReasons regarding the pausing of the project will be coordinated to you by a company representative.\nThank you.",
          projectId: setProjectStatus.data.id,
          origin: "PROJECT",
          userId: setProjectStatus.data.userId
        })

        break
      }

      case "COMPLETED": {
        await createNotificationMutation({
          title: "Completed",
          body: "The project is already completed!\nOur company would like to express its gratitude for your trust and partnership.\nPlease keep an eye on your email inbox for subsequent project completion reminders.",
          projectId: setProjectStatus.data.id,
          origin: "PROJECT",
          userId: setProjectStatus.data.userId
        })

        break
      }

      case "TERMINATED": {
        await createNotificationMutation({
          title: "Terminated",
          body: "Project is Terminated.\nPlease check your email inbox for any further project termination notices.\nThank you.",
          projectId: setProjectStatus.data.id,
          origin: "PROJECT",
          userId: setProjectStatus.data.userId
        })

        break
      }

      default: break
    }
  }

  if (setProjectStatus?.data!?.message || setProjectStatus?.error) {

  }
}

const handlePaymentSetStatus = async (status: string) => {
  const setPaymentStatus: MutationResult<ProjectType> = await setPaymentStatusMutation({
      id: selectedProject?.id,
      paymentStatus: status
  })

  await createActivityMutation({
    userRole: auth.username,
    entry: `${ auth.username }-set-payment-status-${ status }`,
    module: "VIEW-PROJECT",
    category: "UDATE",
    status: (setPaymentStatus?.data!?.id ? "SUCCEEDED" : "FAILED")
  });
  
  if (setPaymentStatus?.data!?.id) {
  }

  if (setPaymentStatus?.data!?.message || setPaymentStatus?.error) {
  }
}



const handleAddContract: SubmitHandler<FieldValues> = async (values) => {
  let uploadedContractFileName= ""
  let {
    contractFileName
  } = values
    
  let formData = new FormData();
  formData.append('file',contractFileName[0])

  const uploadContract: MutationResult<UploadedFile> = await contractUploadsMutation(formData)
  if (uploadContract?.data?.fileName) {
    uploadedContractFileName = uploadContract?.data?.fileName
  }
  
  const updateCurrentProject: MutationResult<ProjectType> = await updateContractFileName({
    id: selectedProject?.id,
    contractFileName: uploadedContractFileName
  })

  await createActivityMutation({
    userRole: auth.type,
    entry: `${ auth.username }-upload-project-assets`,
    module: "VIEW-PROJECT",
    category: "OTHERS",
    status: (updateCurrentProject?.data?.id ? "SUCCEEDED" : "FAILED")
  });

  if(updateCurrentProject?.data?.id){
    toast(
      <div className="flex justify-center items-center gap-x-3">
        <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
        <h1 className="text-white font-grandview-bold">Successfully Uploaded Contract!</h1>
      </div>,
      {
        toastId: "update-user-succeded-toast",
        theme: "colored",
        className: "!bg-primary !rounded",
        progressClassName: "!bg-white"
      }
    )
 }else {
  toast(
    <div className="flex justify-center items-center gap-x-3">
      <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
      <h1 className="text-white font-grandview-bold">No Contract Selected!</h1>
    </div>,
    {
      toastId: "update-app-failed-toast",
      theme: "colored",
      className: "!bg-red-700 !rounded",
      progressClassName: "!bg-white"
    }
  )
 }
}

const validation = {
  contractFileName: {
    required:{
      value: true,
      message: "Upload File Empty"
    }
  }
}

  const [modalTarget, setModalTarget] = useState<any>({})

  const doneModal = useRef<HTMLDialogElement>(null)

  const [updateMilestoneStatus] = useUpdateMilestoneStatusMutation()

  const handleUpdateMilestoneStatus = async () => {
    const update: MutationResult<ProjectMilestone> = await updateMilestoneStatus({
      milestoneNo: modalTarget.milestoneNo,
      projectId: modalTarget.projectId,
      milestoneStatus: "DONE"
    })

    await createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-update-progress-billing-status-DONE`,
      module: "VIEW-PROJECT",
      category: "UPDATE",
      status: (update?.data?.milestoneNo ? "SUCCEEDED" : "FAILED")
    });

    if (update?.data?.milestoneNo) {
      await createNotificationMutation({
        title: `Waiting Progress Billing ${ update.data.milestoneNo } Payment`,
        body: `We completed a progress!\nYou can now pay Progress Billing ${ update.data.milestoneNo }.`,
        projectId: update.data.project!.id,
        origin: "PROJECT",
        userId: update.data.project!.userId
      })

      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully updated progress billing status!</h1>
        </div>,
        {
          toastId: "update-milestone-status-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to update progress billing status!</h1>
        </div>,
        {
          toastId: "update-milestone-status-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  const paidModal = useRef<HTMLDialogElement>(null)

  const [updateMilestoneBillingStatus] = useUpdateMilestoneBillingStatusMutation()

  const handleUpdateMilestoneBillingStatus = async () => {
    const update: MutationResult<ProjectMilestone> = await updateMilestoneBillingStatus({
      milestoneNo: modalTarget.milestoneNo,
      projectId: modalTarget.projectId,
      billingStatus: "PAID",
      remainingBalance: +selectedProject!.remainingBalance - +modalTarget.price
    })

    await createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-update-progress-billing-billing-status-PAID`,
      module: "VIEW-PROJECT",
      category: "UPDATE",
      status: (update?.data?.milestoneNo ? "SUCCEEDED" : "FAILED")
    });

    if (update?.data?.milestoneNo) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully updated progress billing status!</h1>
        </div>,
        {
          toastId: "update-milestone-status-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to update progress billing status!</h1>
        </div>,
        {
          toastId: "update-milestone-status-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  const holdModal = useRef<HTMLDialogElement>(null)

  const resumeModal = useRef<HTMLDialogElement>(null)

  const terminatedModal = useRef<HTMLDialogElement>(null)

  const completedModal = useRef<HTMLDialogElement>(null)

  return (
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | View Project ${ selectedProject?.id.split("-")[0] }` }</title>
      </Helmet>

      <main className={ `${ offset }`}>

        <div className='flex justify-between px-5 items-center'>
            <div className='flex items-center w-full justify-between'>
                <HeaderGroup text={`View Project #${ selectedProject?.id.split("-")[0] }`} link="/admin/project" />
                {(() => {
                  if (selectedProject?.projectStatus === "ONGOING"){
                    return<>
                <form onSubmit={(e) => e.preventDefault()}>
                   <div className="flex flex-row items-center gap-x-3">
                    <button className="transition-all ease-in-out duration-300 tracking-wide rounded-sm bg-transparent border px-3 py-1.5 hover:scale-105 text-[#FF9900] border-[#FF9900] hover:bg-[#FF9900] hover:text-white"
                    onClick={ () => holdModal.current!.show() }>HOLD PROJECT</button> 
                    <button className="transition-all ease-in-out duration-300 tracking-wide rounded-sm bg-transparent border px-3 py-1.5 hover:scale-105 text-[#DE2B2B] border-[#DE2B2B] hover:bg-[#DE2B2B] hover:text-white"
                    onClick={ () => terminatedModal.current!.show() }>TERMINATE PROJECT</button>
                    <button className="transition-all ease-in-out duration-300 tracking-wide rounded-sm bg-transparent border px-3 py-1.5 hover:scale-105 text-[#00BDB3] border-[#00BDB3] hover:bg-[#00BDB3] hover:text-white"
                    onClick={ () => completedModal.current!.show() }>COMPLETE PROJECT</button>
                    </div>
                </form></>} 
                  if (selectedProject?.projectStatus === "ON_HOLD") {
                     return<>
                     <form onSubmit={(e) => e.preventDefault()}>
                        <div className="flex gap-x-2">
                         <button className="transition-all ease-in-out duration-300 tracking-wide rounded-sm bg-transparent border px-3 py-1.5 hover:scale-105 text-[#FF9900] border-[#FF9900] hover:bg-[#FF9900] hover:text-white"
                         onClick={ () => resumeModal.current!.show() }>RESUME PROJECT</button> 
                         <button className="transition-all ease-in-out duration-300 tracking-wide rounded-sm bg-transparent border px-3 py-1.5 hover:scale-105 text-[#DE2B2B] border-[#DE2B2B] hover:bg-[#DE2B2B] hover:text-white"
                         onClick={ () => terminatedModal.current!.show() }>TERMINATE PROJECT</button>
                         <button className="transition-all ease-in-out duration-300 tracking-wide rounded-sm bg-transparent border px-3 py-1.5 hover:scale-105 text-[#00BDB3] border-[#00BDB3] hover:bg-[#00BDB3] hover:text-white"
                         onClick={ () => completedModal.current!.show() }>COMPLETE PROJECT</button>
                         </div>
                     </form></>
                  }else {
                    return<>
                    {/*<form onSubmit={(e) => e.preventDefault()}>
                       <div className="flex gap-x-2">
                        <button className="transition-all ease-in-out duration-300 tracking-wide rounded-sm bg-transparent border px-3 py-1.5 hover:scale-105 text-[#DE2B2B] border-[#DE2B2B] hover:bg-[#DE2B2B] hover:text-white"
                        onClick={()=>handleProjectSetStatus("TERMINATED")}>TERMINATE PROJECT</button>
                        <button className="transition-all ease-in-out duration-300 tracking-wide rounded-sm bg-transparent border px-3 py-1.5 hover:scale-105 text-[#00BDB3] border-[#00BDB3] hover:bg-[#00BDB3] hover:text-white"
                        onClick={()=>handleProjectSetStatus("COMPLETED")}>COMPLETE PROJECT</button>
                        </div>
                    </form>*/}</>
                  }
                })()}
            </div>
        </div>
    
        <main className="flex flex-col gap-y-5 p-5">

          <p className='text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5'>Project Information</p>

          <div className="grid grid-cols-4 justify-start items-end gap-x-10 w-full">            
                        
            <InputGroup id="project-status" label="Project Status:" disabled {...register("projectStatus")} defaultValue={selectedProject ? getProjectStatus(selectedProject?.projectStatus): ""}/> 
            <InputGroup id="payment-status" label="Payment Status:" disabled {...register("paymentStatus")} defaultValue={selectedProject ? getPaymentStatus(selectedProject?.paymentStatus): ""}/>  

            <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex gap-x-2 col-span-2">
              {(() => {
                  switch(selectedProject?.projectStatus) {
                    case "WAITING_CONTRACT": {
                      if(selectedProject?.contractFileName === "-"){
                          return <>
                          </>
                      }else{
                        return <>
                          <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" 
                          type="submit" 
                          onClick={()=>handleProjectSetStatus("SET_MILESTONE")}
                          >Proceed to Set Project Progress Billing
                          </button>
                        </>
                      }
                    }
                    case "SET_MILESTONE": {
                      if(selectedProjectMilestones?.length === 0){
                        return<>
                        </>
                      }else {
                        return <>
                            <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" 
                              type="submit"
                              onClick={()=>handleProjectSetStatus("WAITING_SIGNATURE")}>
                              Proceed to Signature Request
                            </button>
                        </>
                      }
                    }
                    case "WAITING_SIGNATURE": {
                        if (selectedProject?.signedContractFileName === "-"){
                            return<>
                            </>
                        }else {
                          return <>
                          <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" 
                          type="submit"
                          onClick={()=>{handleProjectSetStatus("WAITING_PAYMENT"); handlePaymentSetStatus("WAITING_DOWNPAYMENT")}}
                          >
                            Proceed to Downpayment
                          </button>

                          <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#DE2B2B] px-3 py-1.5 hover:scale-105"
                          type="submit"
                          onClick={() => handleProjectSetStatus("WAITING_SIGNATURE")}
                          >For Revision</button>
                        </>
                        }
                    }
                    case "WAITING_PAYMENT": {
                      return <>
                        <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" 
                        type="submit"
                        onClick={()=> {handleProjectSetStatus("ONGOING"); handlePaymentSetStatus("PAID_DOWNPAYMENT")}}
                        >
                        Set Project as Ongoing
                        </button>
                      </>
                    }
                    default: {
                        return <></>
                    }
                  }
              })()}
            </div>
          </form>
          </div>

          <div className="grid border-b-[#F3F1F1] border-b-2 pb-10 grid-cols-6 justify-start items-end gap-x-10">
          
          <div className="flex flex-col gap-y-5 w-full">
              <InfoGroup label="Project Number" value={selectedProject ? selectedProject?.id : ""}/>
              <InfoGroup label="Client Name" value={selectedProject ? getClientName(selectedProject.user) : ""}/>
            </div>
            <InfoGroup label="Company Name" value={selectedProject? selectedProject.user.companyName: ""}/>
            <InfoGroup label="Contact Number" value={selectedProject? selectedProject.user.contactNumber: ""}/>
            <InfoGroup label="Email Address" value={selectedProject? selectedProject.user.emailAddress: ""}/>
          </div>

          <div className="grid grid-cols-4 border-b-[#F3F1F1] border-b-2 pb-10 justify-start items-end gap-x-10">
          {(() => {
            switch(selectedProject?.projectStatus){
                case "WAITING_CONTRACT" :{
                  if (selectedProject?.contractFileName !== "-"){
                    return<>
                    
                    </>
                  }
                    return <>
                    <form onSubmit={handleSubmit(handleAddContract)}>
                        <label className="hover:cursor-pointer" htmlFor="contractFileName">
                          <InfoGroup label="Project Contract" value="Upload Project Contract"/>
                          <span className="text-sm">Accepted file type: *.doc, *.docx, *.pdf</span>
                          <input className="hidden" type="file" accept=".doc, .docx, .pdf" id="contractFileName" {...register("contractFileName", validation.contractFileName)}/>
                          <div className="flex justify-center mt-2 items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full py-5">
                            <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />
                            <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                          </div>
                        </label>

                        {
                          watch("contractFileName")?.length && watch("contractFileName")[0] ? (
                            <div className="flex flex-row justify-start items-center gap-x-3 mt-2 w-full">
                              <div className="grow transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full lg:w-3/5 px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]">
                                <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[50ch] ">
                                  { watch("contractFileName")[0].name }
                                </span>

                                <button type="button" className="hover:text-red-600" onClick={ () => resetField("contractFileName") }>
                                  <FontAwesomeIcon icon={ faXmark } size="sm" fixedWidth />
                                </button>
                              </div>
                            </div>
                          ) :  (
                            <div className="mt-2">
                                {errors.contractFileName && <span className="text-red-700 ">{errors.contractFileName.message}</span>}
                            </div>
                          )
                        }

                        <button className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-primary px-3 py-1 mt-2 hover:scale-105" type="submit">Add Contract</button>
                      </form>
                    </>
                }
            }
            
          })()}
            {/* TODO: already uploaded contract file -- SET_MILESTONE status */}
             {(() => { 
              if(selectedProject?.contractFileName !== "-"){
              return<>
                  <div className="flex flex-col gap-y-1.5">
                      <label className="text-sm text-[#133061] font-grandview-bold">Project Contract</label>
                      <a className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                          href={selectedProject ? `${process.env.REACT_APP_API_URL}/uploads/${selectedProject.contractFileName}` : '' }
                          target = "blank"
                          rel = "noreferrer noopner">
                        {selectedProject ? selectedProject?.contractFileName : "No File Yet"}</a>
                  </div>

                  <div className="flex flex-col gap-y-1.5">
                      <label className="text-sm text-[#133061] font-grandview-bold">Signed Project Contract</label>
                      <a className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                      href={selectedProject ? `${process.env.REACT_APP_API_URL}/uploads/${selectedProject.signedContractFileName}` : '' }
                      target = "blank"
                      rel = "noreferrer noopner">
                        {selectedProject ? selectedProject?.signedContractFileName : "No File Yet"}</a>
                  </div>
                  </>
              }
              })()}

            {/* TODO: already signed contract -- WAITING_SIGNATURE status */}
          </div>

          <div className="grid grid-cols-4 pb-5 justify-start items-end gap-x-10 w-full">
            <InputGroup id="project-price" label="Project Total Price:" disabled {...register("projectPrice")} />  
            <InputGroup id="dp-price" label="Downpayment Price:" disabled {...register("projectDownPayment")} /> 
            <InputGroup id="remaining-bal" label="Remaining Balance:" disabled {...register("remainingBalance")} /> 
          </div>

          {/* TODO: Milestone Table - SET_MILESTONE status */}
          
          

            {
              (selectedProject?.projectStatus === "SET_MILESTONE" || selectedProject?.projectStatus === "ONGOING" || selectedProject?.projectStatus === "COMPLETED" || selectedProject?.projectStatus === "ON_HOLD" || selectedProject?.projectStatus === "TERMINATED") && (
                <div className="flex border-t-[#F3F1F1] border-t-2 pt-5 flex-col w-full gap-y-1.5">
                  <label className="text-sm text-[#133061] font-grandview-bold">Project Progress Billings</label>
                  
                  <table className='table border border-x-0 w-full'>
                    <thead className="bg-[#0B2653]">
                      <tr>
                        <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>Progress Billing</th>
                        <th className='text-center font-normal text-white text-sm w-1/4 border border-x-1 px-1.5 py-2'>Description</th>
                        <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>Price</th>
                        <th className='text-center font-normal text-white text-sm w-48 border border-x-1 px-1.5 py-2'>Milestone Status</th>
                        <th className='text-center font-normal text-white text-sm w-48 border border-x-1 px-1.5 py-2'>Billing Status</th>
                        <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>From</th>
                        <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>To</th>
                        <th className='text-center font-normal text-white text-sm border border-x-1 px-1.5 py-2'>Actions</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                    {
                      selectedProjectMilestones?.map((milestone: any) => (
                        <tr key={ milestone.milestoneNo }>
                          <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                              { `Progress Billing ${ milestone.milestoneNo }` }
                          </td>
      
                          <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                              { milestone.description }
                          </td>
      
                          <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                              { `PHP ${ milestone.price.toLocaleString("en") }` }
                          </td>
      
                          <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                              { milestone.milestoneStatus }
                          </td>
      
                          <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                              { milestone.billingStatus}
                          </td>
      
                          <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                              { format(parseISO(milestone.startDate), "MM-dd-yyyy") }
                          </td>
      
                          <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                              { format(parseISO(milestone.estimatedEnd), "MM-dd-yyyy") }
                          </td>
      
                          <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                              {
                                milestone.milestoneStatus !== "DONE" && (
                                  <TableAction text="Done" icon={ faCheck } backgroundHoverColor="enabled:hover:bg-[#008D0E]" textHoverColor="enabled:hover:text-[#FFFFFF]" disabled={ selectedProject?.projectStatus !== "ONGOING" } onClick={ () => { setModalTarget({ milestoneNo: milestone.milestoneNo, projectId: milestone.projectId }); doneModal.current!.show() } } /> 
                                )
                              }
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              )
            }
        </main>
      </main>

      <Modal ref={doneModal} padless>
        <div className="h-[10px] bg-[#008D0E] w-full" />

        <div className="grid grid-cols-3 gap-8 border-b max-w-[400px] p-5">
            <div className="col-span-1 flex flex-row justify-center items-start">
              <FontAwesomeIcon icon={ faCheck } color="#008D0E" size="4x" fixedWidth />
            </div>

            <div className="col-span-2 flex flex-col justify-start items-start gap-y-2.5">
              <p className="text-lg font-grandview-bold">Set Milestone as Done?</p>

              <p className="text-sm">Are you sure you want to set <span className="font-grandview-bold">Progress Billing { modalTarget?.milestoneNo }</span> as done?</p>

              <p className="text-sm">You can't undo this action.</p>
            </div>
        </div>

        <menu className="flex flex-row justify-end items-center gap-x-3 px-5 py-3">
            <button className="text-white font-grandview-bold rounded-sm bg-[#008D0E] px-2.5 py-1" type="button" onClick={() => { handleUpdateMilestoneStatus(); doneModal.current!.close() }}>Confirm</button>

            <button className="text-white font-grandview-bold rounded-sm bg-[#D9D9D9] px-2.5 py-1" type="button" onClick={() => doneModal.current!.close()}>Cancel</button>
        </menu>
      </Modal>

      <Modal ref={paidModal} padless>
        <div className="h-[10px] bg-[#3576E1] w-full" />

        <div className="grid grid-cols-3 gap-8 border-b max-w-[400px] p-5">
            <div className="col-span-1 flex flex-row justify-center items-start">
              <FontAwesomeIcon icon={ faMoneyBill } color="#3576E1" size="4x" fixedWidth />
            </div>

            <div className="col-span-2 flex flex-col justify-start items-start gap-y-2.5">
              <p className="text-lg font-grandview-bold">Set Milestone as Paid?</p>

              <p className="text-sm">Are you sure you want to set <span className="font-grandview-bold">Progress Billing { modalTarget?.milestoneNo }</span> as paid?</p>

              <p className="text-sm">You can't undo this action.</p>
            </div>
        </div>

        <menu className="flex flex-row justify-end items-center gap-x-3 px-5 py-3">
            <button className="text-white font-grandview-bold rounded-sm bg-[#3576E1] px-2.5 py-1" type="button" onClick={() => { handleUpdateMilestoneBillingStatus(); paidModal.current!.close() }}>Confirm</button>

            <button className="text-white font-grandview-bold rounded-sm bg-[#D9D9D9] px-2.5 py-1" type="button" onClick={() => paidModal.current!.close()}>Cancel</button>
        </menu>
      </Modal>

      <Modal ref={holdModal} padless>
        <div className="h-[10px] bg-[#FBA11B] w-full" />

        <div className="grid grid-cols-3 gap-8 border-b max-w-[400px] p-5">
            <div className="col-span-1 flex flex-row justify-center items-start">
              <FontAwesomeIcon icon={ faPause } color="#FBA11B" size="4x" fixedWidth />
            </div>

            <div className="col-span-2 flex flex-col justify-start items-start gap-y-2.5">
              <p className="text-lg font-grandview-bold">Hold Project?</p>

              <p className="text-sm">Are you sure you want to set this project on hold?</p>

              <p className="text-sm">You can't undo this action.</p>
            </div>
        </div>

        <menu className="flex flex-row justify-end items-center gap-x-3 px-5 py-3">
            <button className="text-white font-grandview-bold rounded-sm bg-[#FBA11B] px-2.5 py-1" type="button" onClick={() => { handleProjectSetStatus("ON_HOLD"); holdModal.current!.close() }}>Confirm</button>

            <button className="text-white font-grandview-bold rounded-sm bg-[#D9D9D9] px-2.5 py-1" type="button" onClick={() => holdModal.current!.close()}>Cancel</button>
        </menu>
      </Modal>

      <Modal ref={resumeModal} padless>
        <div className="h-[10px] bg-[#FBA11B] w-full" />

        <div className="grid grid-cols-3 gap-8 border-b max-w-[400px] p-5">
            <div className="col-span-1 flex flex-row justify-center items-start">
              <FontAwesomeIcon icon={ faPlay } color="#FBA11B" size="4x" fixedWidth />
            </div>

            <div className="col-span-2 flex flex-col justify-start items-start gap-y-2.5">
              <p className="text-lg font-grandview-bold">Resume Project?</p>

              <p className="text-sm">Are you sure you want to set this project on resume?</p>

              <p className="text-sm">You can't undo this action.</p>
            </div>
        </div>

        <menu className="flex flex-row justify-end items-center gap-x-3 px-5 py-3">
            <button className="text-white font-grandview-bold rounded-sm bg-[#FBA11B] px-2.5 py-1" type="button" onClick={() => { handleProjectSetStatus("ONGOING"); resumeModal.current!.close() }}>Confirm</button>

            <button className="text-white font-grandview-bold rounded-sm bg-[#D9D9D9] px-2.5 py-1" type="button" onClick={() => resumeModal.current!.close()}>Cancel</button>
        </menu>
      </Modal>

      <Modal ref={terminatedModal} padless>
        <div className="h-[10px] bg-[#B00000] w-full" />

        <div className="grid grid-cols-3 gap-8 border-b max-w-[400px] p-5">
            <div className="col-span-1 flex flex-row justify-center items-start">
              <FontAwesomeIcon icon={ faCancel } color="#B00000" size="4x" fixedWidth />
            </div>

            <div className="col-span-2 flex flex-col justify-start items-start gap-y-2.5">
              <p className="text-lg font-grandview-bold">Terminate Project?</p>

              <p className="text-sm">Are you sure you want to cancel this project?</p>

              <p className="text-sm">You can't undo this action.</p>
            </div>
        </div>

        <menu className="flex flex-row justify-end items-center gap-x-3 px-5 py-3">
            <button className="text-white font-grandview-bold rounded-sm bg-[#B00000] px-2.5 py-1" type="button" onClick={() => { handleProjectSetStatus("TERMINATED"); handlePaymentSetStatus("NOT_AVAILABLE"); terminatedModal.current!.close() }}>Confirm</button>

            <button className="text-white font-grandview-bold rounded-sm bg-[#D9D9D9] px-2.5 py-1" type="button" onClick={() => terminatedModal.current!.close()}>Cancel</button>
        </menu>
      </Modal>

      <Modal ref={completedModal} padless>
        <div className="h-[10px] bg-[#00BDB3] w-full" />

        <div className="grid grid-cols-3 gap-8 border-b max-w-[400px] p-5">
            <div className="col-span-1 flex flex-row justify-center items-start">
              <FontAwesomeIcon icon={ faCheckDouble } color="#00BDB3" size="4x" fixedWidth />
            </div>

            <div className="col-span-2 flex flex-col justify-start items-start gap-y-2.5">
              <p className="text-lg font-grandview-bold">Complete Project?</p>

              <p className="text-sm">Are you sure you want to complete this project?</p>

              <p className="text-sm">You can't undo this action.</p>
            </div>
        </div>

        <menu className="flex flex-row justify-end items-center gap-x-3 px-5 py-3">
            <button className="text-white font-grandview-bold rounded-sm bg-[#00BDB3] px-2.5 py-1" type="button" onClick={() => { handleProjectSetStatus("COMPLETED"); completedModal.current!.close() }}>Confirm</button>

            <button className="text-white font-grandview-bold rounded-sm bg-[#D9D9D9] px-2.5 py-1" type="button" onClick={() => completedModal.current!.close()}>Cancel</button>
        </menu>
      </Modal>
    </>
  )
}

export default ViewProject