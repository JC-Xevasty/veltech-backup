import { useRef, useState, Fragment, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useForm, SubmitHandler } from "react-hook-form"
import { useParams } from "react-router-dom"
import { faUpload, faXmark, faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"

import HeaderGroup from "../../../components/HeaderGroup"
import DateGroup from "../../../components/accounting/DateGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import SelectGroup from "../../../components/accounting/SelectGroup"
import Modal from "../../../components/Modal"

import { useFetchPurchaseOrderQuery, usePoDocumentUploadsMutation, useAddPaymentMutation, useSetStatusMutation } from "../../../features/api/purchaseorder"
import { useFetchProjectQuery } from '../../../features/api/project'

import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"

import { MutationResult, PurchaseOrder, UploadedFile } from "../../../types"

import _ from "lodash"
import { validate } from "uuid"
import AddPayment from "../../client/contracts/AddPayment"

import { useCreateActivityMutation } from "../../../features/api/activity.log"

interface FieldValues {
   [key: string]: any,
   poNo: string,
   document: FileList,
}

function ViewPurchaseOrder() {
   const app = useSelector(selectApp)
   const auth = useSelector(selectUser)
   const { poNo } = useParams() as { poNo: string }

   const dataParams = poNo.split("&")

   const { isError, isLoading, data: purchaseOrder } = useFetchPurchaseOrderQuery({ poNo: dataParams[0] })
   const { isError: projectError, isLoading: projectLoading, data: project } = useFetchProjectQuery({ id: dataParams[1] })
   const [uploadFileMutation] = usePoDocumentUploadsMutation()
   const [addPayment] = useAddPaymentMutation()
   const [setStatus] = useSetStatusMutation()
   const [createActivityMutation] = useCreateActivityMutation()

   const [defaults, setDefaults] = useState<any>({})
   const [poDocument, setPoDocument] = useState("")

   const getDate = (dateString: any) => {
      const D = new Date(dateString);

      return `${D.getMonth() + 1}-${D.getDate()}-${D.getFullYear()}`
   }

   const getBalance = (payment: Array<String>, total: number) => {
      let totalPayment = 0
      payment.forEach((value: any) => totalPayment += +value)
      return total - totalPayment
   }

   const [products, setProducts] = useState<string[]>(["product1"])

   const { register, reset, setValue } = useForm<FieldValues>({
      // TODO: Add default values here OR use "reset" inside a useEffect with the data as dependency with example below
      defaultValues: defaults
   })

   useEffect(() => {
      if (purchaseOrder) {
         let defaults = {
            project: project?.user.companyName,
            supplier: purchaseOrder?.supplier.name,
            invoiceDate: getDate(purchaseOrder.createdAt),
            poNo: purchaseOrder?.poNo,
            deliverTo: purchaseOrder.deliverTo,
            contact: purchaseOrder.contact,
            term: purchaseOrder.terms,
            subtotal: 0,
            balance: 0
         }

         let products = purchaseOrder.items.map((_: any, index: number) => `product${index + 1}`)
         let total = 0

         products.forEach((value: string, index: number) => {
            defaults = {
               ...defaults,
               [`${value}Quantity`]: purchaseOrder.items[index].quantity,
               [`${value}Unit`]: purchaseOrder.items[index].unit,
               [`${value}Description`]: purchaseOrder.items[index].description,
               [`${value}NetPrice`]: purchaseOrder.items[index].netPrice,
               [`${value}Amount`]: +purchaseOrder.items[index].quantity * +purchaseOrder.items[index].netPrice
            }
            total += +purchaseOrder.items[index].quantity * +purchaseOrder.items[index].netPrice
         })
         setProducts(products)
         setPoDocument(purchaseOrder.poDocument)
         defaults.subtotal = total
         defaults.balance = getBalance(purchaseOrder.payment, total)
         reset(defaults)
      }
   }, [purchaseOrder, reset])

   const { register: registerPayment, reset: resetPayment, handleSubmit: submitPayment, watch, setError, resetField, formState: { errors } } = useForm<FieldValues>({
      mode: 'onChange'
   })

   const paymentModalRef = useRef<HTMLDialogElement>(null)

   const [proofOfPayment] = watch(["proofOfPayment"])
   const [proofOfPayments, setProofOfPayments] = useState<File[]>([])

   useEffect(() => {
      setProofOfPayments((proofOfPayments) => _.filter(proofOfPayment, (doc) => !_.map(proofOfPayments, (proofOfPayment) => proofOfPayment.name).includes(doc.name)))
   }, [proofOfPayment])

   const validation = {
      project: {
         required: {
            value: false,
            message: 'Project is required'
         }
      },
      supplier: {
         required: {
            value: true,
            message: 'Supplier is required '
         }
      },
      invoiceDate: {
         required: {
            value: false,
            message: 'Must filled up.'
         }
      },
      poNo: {
         required: {
            value: false,
            message: 'Must filled up.'
         }
      },
      deposit: {
         required: {
            value: true,
            message: 'Must filled up.'
         }
      },
      amount: {
         required: {
            value: true,
            message: 'Must filled up.'
         }
      },
      description: {
         required: {
            value: true,
            message: 'Must filled up.'
         }
      },
      netPrice: {
         required: {
            value: true,
            message: 'Must filled up.'
         },
         pattern: {
            value: /^\d+$/,
            message: 'Integer only'
         }
      },
      quantity: {
         required: {
            value: true,
            message: 'Must filled up.'
         },
         pattern: {
            value: /^[1-9][0-9]?$|^100$/,
            message: 'Enter integer only. Maximum of 100'
         }
      },
      unit: {
         required: {
            value: true,
            message: 'Must filled up.'
         },
         pattern: {
            value: /^[A-Za-z]+$/,
            message: 'Enter unit alphabet only'
         }
      },
      deliverTo: {
         required: {
            value: true,
            message: 'Must filled up.'
         },
         maxlength: {
            value: 255,
            message: 'Max characters up to 255'
         }
      },
      contact: {
         required: {
            value: true,
            message: 'Must filled up.'
         },
         pattern: {
            value: /^(09|\+639)\d{9}$/,
            message: 'Any valid Philippine Number'
         }
      },
      subtotal: {
         required: {
            value: true,
            message: 'Must filled up.'
         }
      },
      terms: {
         required: {
            value: true,
            message: 'Must filled up.'
         }
      },
      balance: {
         required: {
            value: true,
            message: 'Must filled up.'
         }
      },
      document: {
         required: { value: (proofOfPayments.length === 0), message: "Proof Payament file must be uploaded" },
         validate: {
            lessThan30MB: (file: FileList) => file[0]?.size < 30000000 || "Maximum size allowed is 30MB",
         }
      }
   };

   const handleAddPayment: SubmitHandler<FieldValues> = async (values) => {
      let payment = []
      let paymentProof = []
      let fileName = ''

      purchaseOrder?.payment.forEach((value: any) => payment.push(value))
      purchaseOrder?.paymentProof.forEach((value: any) => paymentProof.push(value))

      if (proofOfPayments.length === 0) {
         setError('document', { type: 'custom', message: "Proof of Payment file must be uploaded" });
      } else {
         let formData = new FormData();
         formData.append('file', proofOfPayment[0]);

         const poUploads: MutationResult<UploadedFile> = await uploadFileMutation(formData);

         await createActivityMutation({
            userRole: auth.type,
            entry: `${ auth.username }-upload-purchase-order`,
            module: "VIEW-PURCHASE-ORDER",
            category: "CREATE",
            status: (poUploads?.data!?.fileName ? "SUCCEEDED" : "FAILED")
          });

         if (poUploads?.data!?.fileName) {
            fileName = poUploads?.data!?.fileName
            paymentProof?.push(fileName)
            payment?.push(values.payment)

            const setPayment: MutationResult<any> = await addPayment({
               id: purchaseOrder?.id,
               payment: payment,
               paymentProof: paymentProof
            })

            await createActivityMutation({
               userRole: auth.type,
               entry: `${ auth.username }-upload-purchase-order`,
               module: "VIEW-PURCHASE-ORDER",
               category: "CREATE",
               status: (setPayment?.data!?.id ? "SUCCEEDED" : "FAILED")
             });

            if (setPayment) {

               const payment = setPayment?.data!?.payment as String[]

               if (purchaseOrder?.purchaseOrderstatus === "FOR_APPROVAL") {
                  let sum = 0;

                  for (const value of payment) {
                     sum += +value;
                  }

                  if (sum < purchaseOrder.total) {
                     //partially paid
                     const editStatus: MutationResult<any> = await setStatus({
                        id: purchaseOrder.id,
                        purchaseOrderstatus: "PARTIALLY_PAID"
                     })

                     await createActivityMutation({
                        userRole: auth.type,
                        entry: `${ auth.username }-create-payment`,
                        module: "VIEW-PURCHASE-ORDER",
                        category: "UPDATE",
                        status: (editStatus?.data ? "SUCCEEDED" : "FAILED")
                      });

                     console.log(editStatus.error)
                     if (editStatus?.data) {
                        toast(
                           <div className="flex justify-center items-center gap-x-3">
                              <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
                              <h1 className="text-white font-grandview-bold">Payment Added!</h1>
                           </div>,
                           {
                              toastId: "register-succeded-toast",
                              theme: "colored",
                              className: "!bg-primary !rounded",
                              progressClassName: "!bg-white"
                           }
                        )
                     }
                  }
                  else if (sum >= purchaseOrder.total) {
                     //fully paid

                     const editStatus: MutationResult<any> = await setStatus({
                        id: purchaseOrder.id,
                        purchaseOrderstatus: "FULLY_PAID"
                     })

                     await createActivityMutation({
                        userRole: auth.type,
                        entry: `${ auth.username }-create-payment`,
                        module: "VIEW-PURCHASE-ORDER",
                        category: "UPDATE",
                        status: (editStatus?.data ? "SUCCEEDED" : "FAILED")
                      });
                      
                     if (editStatus?.data) {
                        toast(
                           <div className="flex justify-center items-center gap-x-3">
                              <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
                              <h1 className="text-white font-grandview-bold">Payment Added!</h1>
                           </div>,
                           {
                              toastId: "register-succeded-toast",
                              theme: "colored",
                              className: "!bg-primary !rounded",
                              progressClassName: "!bg-white"
                           }
                        )
                     }
                  }

               }
            } else {
               toast(
                  <div className="flex justify-center items-center gap-x-3">
                     <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
                     <h1 className="text-white font-grandview-bold">Failed to upload Purchase Order!</h1>
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


      resetPayment()

      paymentModalRef.current!.close()
   }

   return (
      isError ? <PageError /> :
         projectError ? <PageError /> :
            isLoading ? <LoadingScreen /> :
               projectLoading ? <LoadingScreen /> :
                  <Fragment>
                     <Helmet>
                     <title>{`${app?.appName || "Veltech Inc."} | View P.O. ${ poNo }`}</title>
                     </Helmet>

                     <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
                        <div className="flex justify-between items-center gap-x-10 w-full">
                           <HeaderGroup text={`View Purchase Order ${poNo}`} link="/accounting/purchase-orders" />

                           <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="button" onClick={() => paymentModalRef.current!.show()}>Add Payment</button>
                        </div>

                        <form className="flex flex-col gap-y-5 w-full">
                           <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                              Purchase Order Information
                           </div>

                           <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                              <InputGroup id="project" label="Select Project:" {...register("project")} disabled />

                              <DateGroup id="invoice-date" label="Invoice Date:" {...register("invoiceDate")} disabled />
                           </div>

                           <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                              <InputGroup id="supplier" label="Select Supplier:" {...register("supplier")} disabled />

                              <InputGroup id="po-number" label="PO Number:" {...register("poNo")} readOnly />
                           </div>

                           {/* <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                              <div className="col-start-2 col-span-1 w-full">
                                 <InputGroup id="po-number" label="Partial/Deposit:" {...register("deposit")} readOnly />
                              </div>
                           </div> */}

                           <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                              Products
                           </div>

                           <div className="grid grid-cols-15 border-y border-y-[#DBDBDB] py-2.5">
                              <div className="col-start-1 col-span-2 px-1.5">
                                 <span>Quantity</span>
                              </div>

                              <div className="col-start-3 col-span-2 px-1.5">
                                 <span>Unit</span>
                              </div>

                              <div className="col-start-5 col-span-6 px-1.5">
                                 <span>Description</span>
                              </div>

                              <div className="col-start-11 col-span-2 px-1.5">
                                 <span>Net Price</span>
                              </div>

                              <div className="col-start-13 col-span-3 px-1.5">
                                 <span>Amount</span>
                              </div>
                           </div>

                           {
                              products.map((value) => (
                                 <div className="grid grid-cols-15 gap-x-2.5" key={value}>
                                    <div className="col-start-1 col-span-2">
                                       <InputGroup id={`${value}Quantity`} {...register(`${value}Quantity`)} readOnly />
                                    </div>

                                    <div className="col-start-3 col-span-2">
                                       <InputGroup id={`${value}Unit`} {...register(`${value}Unit`)} readOnly />
                                    </div>

                                    <div className="col-start-5 col-span-6">
                                       <InputGroup id={`${value}Description`} {...register(`${value}Description`)} readOnly />
                                    </div>

                                    <div className="col-start-11 col-span-2">
                                       <InputGroup id={`${value}NetPrice`} {...register(`${value}NetPrice`)} readOnly />
                                    </div>

                                    <div className="col-start-13 col-span-3">
                                       <div className="flex flex-row justify-start items-center gap-x-2.5">
                                          <InputGroup id={`${value}Amount`} {...register(`${value}Amount`)} readOnly />
                                       </div>
                                    </div>
                                 </div>
                              ))
                           }

                           <div className="grid grid-cols-5 gap-x-5 w-full">
                              <div className="col-start-1 col-span-3 flex flex-col gap-y-5">
                                 <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                                    Others
                                 </div>

                                 <div className="grid grid-cols-7 gap-x-2.5">
                                    <div className="col-start-1 col-span-4">
                                       <InputGroup id="deliver-to" label="Deliver To:" {...register("deliverTo")} readOnly />
                                    </div>

                                    <div className="col-start-5 col-span-3">
                                       <InputGroup id="contact" label="Contact:" {...register("contact")} readOnly />
                                    </div>
                                 </div>

                                 <InputGroup id="terms" label="Terms:" {...register("term")} readOnly />
                              </div>

                              <div className="col-start-4 col-span-2 flex flex-col gap-y-5">
                                 <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                                    Total
                                 </div>

                                 <InputGroup id="subtotal" label="Subtotal:" {...register("subtotal")} readOnly />

                                 <InputGroup id="balance" label="Balance Due:" {...register("balance")} readOnly />
                              </div>
                           </div>

                           <div className="grid grid-cols-7 w-full">
                              <div className="col-start-1 col-span-2">
                                 <div className="flex flex-col justify-start items-start gap-y-3 w-full">
                                    <span className="text-accent text-sm font-grandview-bold">
                                       Purchase Order Document:
                                    </span>

                                    <div className="rounded-sm bg-[#E6E8EB] border border-[#E6E8EB] w-[350px] px-2.5 py-1">
                                       <span className="text-xs text-[#858585]">{poDocument}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </form>
                     </main>

                     <Modal ref={paymentModalRef}>
                        <form className="flex flex-col justify-start items-start gap-y-5" onSubmit={submitPayment(handleAddPayment)}>
                           <span className="text-accent text-xl font-grandview-bold">Add Payment</span>

                           <InputGroup id="payment" label="Amount" {...registerPayment("payment")} />

                           <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
                              <span className="text-accent text-sm font-grandview-bold">Proof of Payment</span>

                              <span className="text-xs leading-5">Upload Purchase Order Document.<br />Accepted file type: *.jpeg, *.jpg, *.png, *.pdf</span>

                              <label className="hover:cursor-pointer w-full" htmlFor="proofOfPayment">
                                 <input className="hidden" type="file" accept=".doc, .docx, .pdf" multiple {...registerPayment("proofOfPayment", validation.document)} id="proofOfPayment" />

                                 <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed py-5">
                                    <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                                    <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                                 </div>
                              </label>
                              {errors?.document && <span className="text-sm text-red-700">{errors.document.message}</span>}
                              <div className="flex flex-col gap-y-2.5"></div>
                              {
                                 proofOfPayments.map((proofOfPayment, index) => (
                                    <div className="transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]" key={`floor-plan-${index + 1}`}>
                                       <span className="line-clamp-1 max-w-[50ch]">{proofOfPayment.name}</span>

                                       <button type="button" onClick={() => { resetField("document") }}>
                                          <FontAwesomeIcon icon={faXmark} fixedWidth />
                                       </button>
                                    </div>
                                 ))
                              }
                           </div>

                           <menu className="self-start flex flex-row justify-start items-center gap-x-5">
                              <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="submit">Submit</button>

                              <button className="transition-all ease-in-out duration-300 text-[#333333] tracking-wide rounded-sm bg-[#EBEBEB] px-3 py-1.5 hover:scale-105" type="button" onClick={() => { resetPayment(); paymentModalRef.current!.close() }}>Cancel</button>
                           </menu>
                        </form>
                     </Modal>
                  </Fragment >
   )
}

export default ViewPurchaseOrder