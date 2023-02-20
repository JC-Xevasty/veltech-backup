import { Helmet } from "react-helmet-async"
import { useForm, SubmitHandler } from "react-hook-form"
import { useParams } from "react-router-dom"
import { faEdit, faEye ,faCheckCircle, faX, faXmark} from "@fortawesome/free-solid-svg-icons"
import HeaderGroup from "../../../components/HeaderGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import DateGroup from "../../../components/accounting/DateGroup"
import React, { useEffect, useRef ,useState} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import Modal from "../../../components/Modal"
import { format, parseISO } from "date-fns"
import TableAction from "../../../components/TableAction"

import type { OutletContext , Project as ProjectType, User, MutationResult, ProjectMilestone as ProjectMilestoneType} from "../../../types"
import { useFetchProjectQuery, useCreateMilestoneMutation, useUpdateMilestoneMutation, useFetchMilestonesQuery} from "../../../features/api/project"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { useCreateActivityMutation } from "../../../features/api/activity.log"
import { selectUser } from "../../../features/auth/auth"

interface FieldValues {
   description: string
   price: string
   startDate: string
   estimatedEnd: string
   projectPrice: string
   projectDownPayment: string
   remainingBalance: string
   editDescription: string
   editPrice: string
   editStartDate: string
   editEstimatedEnd: string
   projectId?: string
   milestoneNo?: number
}

const PROJECT_STATUS = {
   NOT_AVAILABLE: "Not Available",
   WAITING_CONTRACT: "Waiting Contract",
   WAITING_SIGNATURE: "Waiting Signature",
   WAITING_PAYMENT:"Waiting Payment",
   WAITING_APPROVAL:"Waiting Approval",
   SET_MILESTONE:"Set Milestone",
   ONGOING:"On Going",
   COMPLETED:"Completed",
   ON_HOLD:"On Hold",
   TERMINATED:"Terminated"
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
      text: "Waiting Payment",
    },
   WAITING_APPROVAL: {
     text: "Waiting Approval",
   },
   PAID_BILLING: {
     text: "Paid",
   },
   PROGRESS_BILLING: {
     text: "Progress Billing"
   },
   FULLY_PAID:{
     text: "Fully Paid"
   }
 }

function ViewProject() {
   const app = useSelector(selectApp)

   const auth = useSelector(selectUser)

  const {id: projectId} = useParams() as {id:string}

  const { isLoading, isError, data: selectedProject } = useFetchProjectQuery({id:projectId})

  const { register, handleSubmit, reset, resetField, setValue, formState:{ errors } } = useForm<FieldValues>({})

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, resetField: resetFieldEdit, setValue: setValueEdit, formState:{ errors: errorsEdit } } = useForm<FieldValues>({})

  const [totalProjectPrice,setTotalProjectPrice] =useState<{ totalPayment: number, downPayment: number }>({ totalPayment: 0, downPayment: 0 });

  const [createMilestone] = useCreateMilestoneMutation();

  const {data: selectedProjectMilestones} = useFetchMilestonesQuery({projectId: projectId})

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

  useEffect(()=>{
   if(selectedProject){
      computeTotal(selectedProject)
   }
   //console.log(milestoneNum)
},[selectedProject,selectedProjectMilestones])

   let milestoneNum = selectedProjectMilestones?.length ? parseInt(selectedProjectMilestones.length.toString()) : 0;
   const totalMilestones = milestoneNum + 1
  
   useEffect(() => {
      reset({
         projectPrice: stringToPrice(totalProjectPrice.totalPayment),
         projectDownPayment: stringToPrice(totalProjectPrice.downPayment),
         remainingBalance: selectedProject ? stringToPrice(selectedProject.remainingBalance) : "PHP 0.00"
      })
   }, [totalProjectPrice])

   const handleCreateMilestone : SubmitHandler<FieldValues> = async(values) =>{
      let {
         price,
         description,
         estimatedEnd,
         startDate,
      } = values
   
      const createdMilestone: MutationResult<ProjectMilestoneType> = await createMilestone({
         milestoneNo:totalMilestones,
         price:parseFloat(price),
         description,
         estimatedEnd: estimatedEnd,
         startDate: startDate,
         projectId: projectId,
         billingStatus: "UNPAID",
         milestoneStatus: "ONGOING",
         paymentStatus:selectedProject?.paymentStatus
      })

      await createActivityMutation({
         userRole: auth.type,
         entry: `${ auth.username }-create-progress-billing`,
         module: "VIEW-PROJECTS",
         category: "CREATE",
         status: (createdMilestone?.data?.milestoneNo ? "SUCCEEDED" : "FAILED")
       });

      if(createdMilestone?.data?.milestoneNo){
         toast(
            <div className="flex justify-center items-center gap-x-3">
              <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
              <h1 className="text-white font-grandview-bold">Successfully Added Progress Billing!</h1>
            </div>,
            {
              toastId: "update-user-succeded-toast",
              theme: "colored",
              className: "!bg-primary !rounded",
              progressClassName: "!bg-white"
            }
          )
          resetField("description")
          resetField("price")
          resetField("estimatedEnd")
          resetField("startDate")
          addMilestoneModalRef.current!.close()
      }  else {
         console.log("Not Created")
      }
   }

   const [updateMilestone] = useUpdateMilestoneMutation()

   const [createActivityMutation] = useCreateActivityMutation();

   const handleEditMilestone: SubmitHandler<FieldValues> = async (values) => {
      let {
         price,
         description,
         estimatedEnd,
         startDate,
         projectId,
         milestoneNo
      } = values

      const update: MutationResult<ProjectMilestoneType> = await updateMilestone({
         price: +price,
         description,
         estimatedEnd,
         startDate,
         projectId,
         milestoneNo
      })

      await createActivityMutation({
         userRole: auth.type,
         entry: `${ auth.username }-update-progress-billing`,
         module: "VIEW-PROJECTS",
         category: "UPDATE",
         status: (update?.data?.milestoneNo ? "SUCCEEDED" : "FAILED")
       });

      if (update?.data?.milestoneNo) {
         toast(
            <div className="flex justify-center items-center gap-x-3">
              <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
              <h1 className="text-white font-grandview-bold">Successfully Edited Progress Billing!</h1>
            </div>,
            {
              toastId: "update-user-succeded-toast",
              theme: "colored",
              className: "!bg-primary !rounded",
              progressClassName: "!bg-white"
            }
          )

          resetEdit()

          editMilestoneModalRef.current!.close()
      } else {
         toast(
            <div className="flex justify-center items-center gap-x-3">
              <FontAwesomeIcon className="text-white" icon={ faXmark } size="lg" fixedWidth />
              <h1 className="text-white font-grandview-bold">Failed to Edit Progress Billing!</h1>
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

   const getProjectStatus = (project: string): string => {
      if (project === 'NOT_AVAILABLE') return PROJECT_STATUS.NOT_AVAILABLE;
      if (project === 'WAITING_CONTRACT') return PROJECT_STATUS.WAITING_CONTRACT;
      if (project === 'WAITING_SIGNATURE') return PROJECT_STATUS.WAITING_SIGNATURE;
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
    if (project === "WAITING_DOWNPAYMENT") return PAYMENT_STATUS.WAITING_PAYMENT.text;
    if (project === "PROGRESS_BILLING") return PAYMENT_STATUS.PROGRESS_BILLING.text;
    if (project === "FULLY_PAID") return PAYMENT_STATUS.FULLY_PAID.text;
    return PAYMENT_STATUS.NOT_AVAILABLE.text;
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

 const stringToPrice = (val: number): string => {
   if (!val) return "PHP -"
   return `PHP ${parseFloat(val.toString()).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
 }

 const validation = {
   description: {
      required:{
         value: true,
         message: "Description is Required."
      }
   },
   price: {
      required:{
         value: true,
         message: "Price is is Required."
      },
      pattern:{
         value: /^(?=.*[1-9])\d*\.?[\d]+$/gm,
         message: "Price is Invalid"
      },
      validate: {
         greaterThanOne: (price: string) => parseFloat(price) >= 1 || "Establishment Size must be greater than 1.",
       }
   },
   startDate:{
      required:{
         value: true,
         message: "Start Date is Required."
      }
   },
   estimatedEnd:{
      required:{
         value: true,
         message: "End Date is Required."
      }
   }
 }

const addMilestoneModalRef = useRef<HTMLDialogElement>(null)

const editMilestoneModalRef = useRef<HTMLDialogElement>(null)
 
 const [editModalTarget, setEditModalTarget] = useState<{
   description: string
   price: string
   startDate: string
   estimatedEnd: string
   projectId: string
   milestoneNo: string
 } | any>({})

   return (
      <>
         <Helmet>
            <title>{`${app?.appName || "Veltech Inc."} | View Project #${ selectedProject?.id.split("-")[0] }`}</title>
         </Helmet>

         <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
            <HeaderGroup text={`View Project #${ selectedProject?.id.split("-")[0] }`} link="/accounting/projects" />

            <p className='text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5'>Project Information</p>


               <div className="grid grid-cols-4 gap-x-5">
                  <InputGroup id="project-status"  disabled label="Project Status"  defaultValue= {selectedProject ? getProjectStatus(selectedProject.projectStatus): ""}/>
                  <InputGroup id="payment-status"  disabled label="Payment Status"  defaultValue= {selectedProject ? getPaymentStatus(selectedProject.paymentStatus): ""} />
               </div>  

               <div className="grid grid-cols-4 gap-x-5">
                  <InputGroup id="project-number"  disabled label="Project Number"  defaultValue= {selectedProject ? selectedProject.id : ""}/>
               </div>    

               <div className="grid grid-cols-4 gap-x-5">
                  <InputGroup id="client-name" disabled label="Client Name" defaultValue={selectedProject ? getClientName(selectedProject.user) : ""}/>
                  <InputGroup id="company-name" disabled label="Company Name" defaultValue= {selectedProject ? selectedProject.user.companyName: ""}/>
                  <InputGroup id="contact-number"  disabled label="Contact Number" defaultValue= {selectedProject ? selectedProject.user.contactNumber : ""}/>
                  <InputGroup id="email" disabled label="Email Address" defaultValue= {selectedProject ? selectedProject.user.emailAddress : ""}/>
               </div>
               {/* TODO: only show if contract is signed and status is SET_MILESTONE */}
               {(() => {
                  switch(selectedProject?.signedContractFileName){
                     case ("-"): return <></>

                     default:{
                        return (
                           <>
                              <div className="grid grid-cols-4 gap-x-5">
                                 <div className="flex flex-col gap-y-1.5">
                                    <label className='text-sm text-[#133061] font-grandview-bold' htmlFor="signedContract">Signed Contract</label>
                                    <button className="bg-[#E6E8EB] w-full py-1.5 rounded-sm text-start px-3 text-[#858585] text-sm">signed_contract.pdf</button>
                                 </div>
                              </div>
                           </>
                        )
                     }
                  }
               })()}
               <div className="grid grid-cols-4 gap-x-5">
                  <InputGroup id="total-price" disabled label="Project Total Price" { ...register("projectPrice") } defaultValue={selectedProject ? stringToPrice(totalProjectPrice.totalPayment): "PHP 0.00" } />
                  <InputGroup id="downpayment-price" disabled label="Downpayment Price" {...register("projectDownPayment")} defaultValue = {selectedProject ? stringToPrice(totalProjectPrice.downPayment): "PHP 0.00" } />
                  <InputGroup id="remaining-balance" disabled label="Remaining Balance" {...register("remainingBalance")} defaultValue = {"PHP " + selectedProject?.remainingBalance} />
               </div>

               {
                  (selectedProject?.projectStatus === "SET_MILESTONE" || selectedProject?.projectStatus === "ONGOING" || selectedProject?.projectStatus === "COMPLETED" || selectedProject?.projectStatus === "ON_HOLD" || selectedProject?.projectStatus === "TERMINATED") && (
                     <>
                        <div className="flex flex-col gap-y-1.5">
                           <button onClick={ () => addMilestoneModalRef.current!.show()} className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-[#0B2653] px-3 py-1 hover:scale-105">Add Progress Billing</button>
                        </div>

                        <label className='text-sm text-[#133061] font-grandview-bold'>Progress Billing Table</label>
                     
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
                                 selectedProjectMilestones?.map((milestone) => (
                                    <tr key={ milestone.milestoneNo }>
                                       <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                          {`Progress Billing ${ milestone.milestoneNo }`}
                                       </td>

                                       <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                          { milestone.description }
                                       </td>

                                       <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                          { milestone ? `PHP ${ milestone.price.toLocaleString("en") }` : "" }
                                       </td>
                                    
                                       <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                          { milestone.milestoneStatus}
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

                                       {
                                          milestone.milestoneStatus !== "DONE" && (
                                             <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                                {/* TODO: Action for Milestone */}
                                                <TableAction text="Edit" icon={ faEdit } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#EE9D00]" onClick={ () => { resetEdit({
                                                   description: milestone.description,
                                                   price: milestone.price.toString(),
                                                   startDate: format(parseISO(milestone.startDate), "MM/dd/yyyy"),
                                                   estimatedEnd: format(parseISO(milestone.estimatedEnd), "MM/dd/yyyy"),
                                                   projectId: milestone.projectId,
                                                   milestoneNo: milestone.milestoneNo
                                                }); editMilestoneModalRef.current!.show() } } />
                                             </td>
                                          )
                                       }
                                       
                                    </tr>
                                 ))
                              }
                           </tbody>
                        </table>   
                     </>
                  )
               }
         </main>

         <Modal ref={addMilestoneModalRef}>
            <form className="flex flex-col p-3 gap-y-3" onSubmit={ handleSubmit(handleCreateMilestone) }>
               <h3 className="text-lg font-grandview-bold text-accent">Add Progress Billing</h3>
               <InputGroup label="Description" id="description"  {...register("description",validation.description)}/>
               {errors.description && <span className="text-red-700"> {errors.description.message}</span>}
               <InputGroup label="Price" id="price" {...register("price",validation.price)}/>
               {errors.price && <span className="text-red-700"> {errors.price.message}</span>}
               <DateGroup label="From" id="startDate" { ...register("startDate",validation.startDate) }/>
               {errors.startDate && <span className="text-red-700"> {errors.startDate.message}</span>}
               <DateGroup label="To" id="estimatedEnd" { ...register("estimatedEnd",validation.estimatedEnd) }/>
               {errors.estimatedEnd && <span className="text-red-700"> {errors.estimatedEnd.message}</span>}
               <div className="flex flex-row gap-x-2">
                  <button type ="submit" className="transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-[#0B2653] px-3 py-1 hover:scale-105">Save Milestone</button>
                  <button type="button" onClick={() => addMilestoneModalRef.current!.close()} className="transition-all ease-in-out duration-300 text-[#0B2653] tracking-wide rounded border border-[#0B2653] px-3 py-1 hover:scale-105">Cancel</button>
               </div>
            </form>
         </Modal>

         <Modal ref={editMilestoneModalRef}>
            <form className="flex flex-col p-3 gap-y-3" onSubmit={ handleSubmitEdit(handleEditMilestone) }>
               <h3 className="text-lg font-grandview-bold text-accent">Edit Progress Billing</h3>
               <input className="hidden" type="text" { ...registerEdit("projectId") } />
               <input className="hidden" type="text" { ...registerEdit("milestoneNo") } />
               <InputGroup label="Description" id="description-edit" {...registerEdit("description",validation.description)}/>
               {errorsEdit.description && <span className="text-red-700"> {errorsEdit.description.message}</span>}
               <InputGroup label="Price" id="price-edit" {...registerEdit("price",validation.price)}/>
               {errorsEdit.price && <span className="text-red-700"> {errorsEdit.price.message}</span>}
               <DateGroup label="From" id="startDate-edit" { ...registerEdit("startDate",validation.startDate) }/>
               {errorsEdit.startDate && <span className="text-red-700"> {errorsEdit.startDate.message}</span>}
               <DateGroup label="To" id="estimatedEnd-edit" { ...registerEdit("estimatedEnd",validation.estimatedEnd) }/>
               {errorsEdit.estimatedEnd && <span className="text-red-700"> {errorsEdit.estimatedEnd.message}</span>}
               <div className="flex flex-row gap-x-2">
                  <button type ="submit" className="transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-[#0B2653] px-3 py-1 hover:scale-105">Save Changes</button>
                  <button type="button" onClick={() => editMilestoneModalRef.current!.close()} className="transition-all ease-in-out duration-300 text-[#0B2653] tracking-wide rounded border border-[#0B2653] px-3 py-1 hover:scale-105">Cancel</button>
               </div>
            </form>
         </Modal>

         {/*<Modal ref={editMilestoneModalRef}>
            <div className="flex flex-col gap-y-5 w-full">
               <InputGroup label="Description" id="milestone-description"  {...register("description")}/>
               <InputGroup label="Price" id="milestone-price" {...register("price")}/>
               <DateGroup label="From" id="milestone-from" { ...register("startDate") }/>
               <DateGroup label="To" id="miletsone-to" { ...register("estimatedEnd") }/>
            </div>
         </Modal>*/}
      </>
   )
 }
 
 export default ViewProject