import { useState, Fragment, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { faTrashCan, faUpload, faCheckCircle, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import HeaderGroup from "../../../components/HeaderGroup"
import DateGroup from "../../../components/accounting/DateGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import SelectGroup from "../../../components/accounting/SelectGroup"

import { useCreateProductsMutation, useCreatePurchaseOrderMutation, usePoDocumentUploadsMutation, useFetchPurchaseOrderListQuery } from '../../../features/api/purchaseorder'
import { useFetchAuthenticatedQuery } from '../../../features/api/user'
import { useFetchSuppliersQuery } from '../../../features/api/supplier'
import { useFetchProjectsByQueryQuery } from '../../../features/api/project'

import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import { MutationResult, UploadedFile } from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"

import _ from "lodash"

import { useCreateActivityMutation } from "../../../features/api/activity.log"

interface FieldValues {
   [key: string]: any,
   document: FileList
}

function zeroFill(number: any, width: any, osign: any) {
   var num = '' + Math.abs(number),
      zerosw = width - num.length,
      sign = number >= 0;
   return (sign ? (osign ? '+' : '') : '-') +
      Math.pow(10, Math.max(0, zerosw)).toString().substr(1) + num;
}


function CreatePurchaseOrder() {
   const app = useSelector(selectApp)
   const auth = useSelector(selectUser)
   const navigate = useNavigate()

   const { register, unregister, handleSubmit, watch, resetField, setValue, getValues, setError, formState: { errors } } = useForm<FieldValues>({
      mode: 'onChange',
   })


   //mutations

   const [createPurchaseOrderMutation] = useCreatePurchaseOrderMutation()
   const [createProductsMutation] = useCreateProductsMutation()
   const [uploadFileMutation] = usePoDocumentUploadsMutation()
   const [createActivityMutation] = useCreateActivityMutation();

   //fetch Data (Project and Supplier and User)

   const { isError: authError, isLoading: authLoading, data: user } = useFetchAuthenticatedQuery()

   const [filter, setFilter] = useState<{ query: string }>({ query: "" })

   const { isLoading: supplierLoading, isError: supplierError, data: suppliers } = useFetchSuppliersQuery("")
   const { isLoading: projectLoading, isError: projectError, data: projects } = useFetchProjectsByQueryQuery(filter);
   const { isLoading: purchaseOrdersLoading, isError: purchaseOrdersError, data: purchaseOrders } = useFetchPurchaseOrderListQuery();

   let purchaseOrderCount = 0
   let currentYear = new Date().getFullYear()

   let supplierSelect = [
      {
         name: "",
         value: ""
      }
   ]

   let projectSelect = [
      {
         name: "",
         value: ""
      }
   ]

   if (suppliers)
      suppliers?.forEach((element: any) => {
         supplierSelect.push({
            name: element.name,
            value: element.id
         })
      });

   if (projects)
      projects?.forEach((element: any) => {
         projectSelect.push({
            name: element.user.companyName,
            value: element.id
         })
      });

   if (purchaseOrders) {
      purchaseOrderCount = purchaseOrders?.length
   }

   const [poDocument] = watch(["document"])
   const [poDocuments, setPoDocuments] = useState<File[]>([])

   useEffect(() => {
      setPoDocuments((poDocuments) => _.filter(poDocument, (doc) => !_.map(poDocuments, (poDocument) => poDocument.name).includes(doc.name)))
   }, [poDocument])

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
         required: { value: (poDocuments.length === 0), message: "Purchase Order file must be uploaded" },
         validate: {
            lessThan30MB: (file: FileList) => file[0]?.size < 30000000 || "Maximum size allowed is 30MB",
            // acceptedFormats: (floorPlan: FileList) => ['application/pdf'].includes(floorPlan[0]?.type) || 'Only PNG, JPEG e GIF',
         }
      }
   };


   const [subtotal, setSubtotal] = useState<number>()


   const handleOnChange = (value: string) => {
      if (watch(`${value}Quantity`) && watch(`${value}NetPrice`)) {
         setValue(`${value}Amount`, +watch(`${value}Quantity`) * +watch(`${value}NetPrice`))
      }

      setSubtotal(() => {
         let index = 1
         let productItemExist = true
         let total = 0

         while (productItemExist) {
            const quantity = getValues(`product${index}Quantity`) ? getValues(`product${index}Quantity`) : 0
            const netPrice = getValues(`product${index}NetPrice`) ? getValues(`product${index}NetPrice`) : 0
            total += quantity * netPrice
            if (getValues(`product${index + 1}Quantity`)) {
               productItemExist = true
            } else {
               productItemExist = false
            }
            index += 1
         }
         return total
      })
   }

   const STATUS = {
      FOR_APPROVAL: {
         text: "For Approval",
         value: "FOR_APPROVAL",
         color: "bg-[#3073E2]"
      },
      APPROVED: {
         text: "Approved",
         value: "APPROVED",
         color: "bg-[#53B45A]"
      },
      PARTIALLY_PAID: {
         text: "Partially Paid",
         value: "PARTIALLY_PAID",
         color: "bg-[#FF9900]"
      },
      FULLY_PAID: {
         text: "FULLY Paid",
         value: "FULLY_PAID",
         color: "bg-[#D12B2E]"
      },
      PO_SENT: {
         text: "P.O. Sent",
         value: "PO_SENT",
         color: "bg-[#7D1F8C]"
      }
   }

   const [products, setProducts] = useState<string[]>(["product1"])

   const handleAddProduct = () => {
      setProducts((products) => {
         const max = Math.max(...products.map((product) => +product.charAt(product.length - 1)))
         return [...products, `product${max + 1}`]
      })
   }

   const handleDeleteProduct = (key: string) => {
      setProducts((products) => products.filter((product) => product !== key))

      unregister([`${key}Quantity`, `${key}Unit`, `${key}Description`, `${key}NetPrice`, `${key}Amount`])
   }

   const handleCreate: SubmitHandler<FieldValues> = async (values) => {
      console.log(values)
      let fileName = ""

      const { deliverTo, poNo, supplier, term, project, contact } = values

      if (poDocuments.length === 0) {
         setError('document', { type: 'custom', message: "Purchase Order file must be uploaded" });
      } else {
         let formData = new FormData();
         formData.append('file', poDocument[0]);

         const poUploads: MutationResult<UploadedFile> = await uploadFileMutation(formData);

         await createActivityMutation({
            userRole: auth.type,
            entry: `${ auth.username }-upload-payment-proof`,
            module: "CREATE-PURCHASE-ORDER",
            category: "CREATE",
            status: (poUploads?.data!?.fileName ? "SUCCEEDED" : "FAILED")
          });

         if (poUploads?.data!?.fileName) {
            fileName = poUploads?.data!?.fileName
         }
      }

      let index = 1
      let productItemExist = true
      let total = 0

      while (productItemExist) {
         const quantity = getValues(`product${index}Quantity`)
         const netPrice = getValues(`product${index}NetPrice`)
         console.log(quantity)
         console.log(netPrice)
         total += quantity * netPrice
         if (getValues(`product${index + 1}Quantity`)) {
            productItemExist = true
         } else {
            productItemExist = false
         }
         index += 1
      }

      console.log(total)

      const createPurchaseOrder: MutationResult<any> = await createPurchaseOrderMutation({
         projectId: project,
         supplierId: supplier,
         poNo: `${currentYear}-${zeroFill(purchaseOrderCount, 3, '')}`,
         preparedById: user?.id,
         approvedById: user?.id, //temp
         purchaseOrderstatus: STATUS.FOR_APPROVAL.value,
         deliverTo: deliverTo,
         terms: term,
         total: total,
         contact: contact,
         poDocument: fileName
      })

      await createActivityMutation({
         userRole: auth.type,
         entry: `${ auth.username }-upload-purchase-order`,
         module: "CREATE-PURCHASE-ORDER",
         category: "CREATE",
         status: (createPurchaseOrder?.data!?.id ? "SUCCEEDED" : "FAILED")
       });

      if (createPurchaseOrder?.data!?.id) {
         console.log("OK")

         let purchaseOrderId = createPurchaseOrder?.data!?.id

         let index = 1
         let productItemExist = true

         while (productItemExist) {
            const quantity = parseInt(getValues(`product${index}Quantity`))
            const unit = getValues(`product${index}Unit`)
            const description = getValues(`product${index}Description`)
            const netPrice = getValues(`product${index}Amount`)


            const createProduct: MutationResult<any> = await createProductsMutation({
               purchaseOrderId, quantity, unit, description, netPrice
            })

            await createActivityMutation({
               userRole: auth.type,
               entry: `${ auth.username }-create-product`,
               module: "CREATE-PURCHASE-ORDER",
               category: "CREATE",
               status: (createProduct?.data ? "SUCCEEDED" : "FAILED")
            });
      

            if (createProduct?.data) {
               console.log("Product Inserted.")
            } else {
               console.log("Product insertion failed.")
            }

            if (getValues(`product${index + 1}Description`)) {
               productItemExist = true
            } else {
               productItemExist = false
            }
            index += 1
         }

         toast(
            <div className="flex justify-center items-center gap-x-3">
               <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
               <h1 className="text-white font-grandview-bold">Purchase Order Created!</h1>
            </div>,
            {
               toastId: "register-succeded-toast",
               theme: "colored",
               className: "!bg-primary !rounded",
               progressClassName: "!bg-white"
            }
         )

         window.scrollTo(0, 0)

         navigate("/accounting/purchase-orders", {
            replace: true
         })
      } else {
         console.log(createPurchaseOrder?.error)
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

   return (
      authLoading ? <LoadingScreen /> :
         supplierLoading ? <LoadingScreen /> :
            projectLoading ? <LoadingScreen /> :
               purchaseOrdersLoading ? <LoadingScreen /> :
                  authError ? <PageError /> :
                     supplierError ? <PageError /> :
                        projectError ? <PageError /> :
                           purchaseOrdersError ? <PageError /> :
                              <Fragment>
                                 <Helmet>
                                 <title>{`${app?.appName || "Veltech Inc."} | Create P.O.`}</title>
                                 </Helmet>

                                 <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
                                    <HeaderGroup text="Add Purchase Order" link="/accounting/purchase-orders" />

                                    <form className="flex flex-col gap-y-5 w-full" onSubmit={handleSubmit(handleCreate)}>
                                       <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                                          Purchase Order Information
                                       </div>

                                       <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                                          <SelectGroup id="project" options={projectSelect.map((res: any) => res.name)} values={projectSelect.map((res: any) => res.value)} label="Select Project:" {...register("project", validation.project)} error={errors.project} />

                                          <DateGroup id="invoice-date" label="Invoice Date:" {...register("invoiceDate")} />
                                       </div>

                                       <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                                          <SelectGroup id="supplier" options={supplierSelect.map((res: any) => res.name)} values={supplierSelect.map((res: any) => res.value)} label="Select Supplier:" {...register("supplier", validation.supplier)} error={errors.supplier} />

                                          <InputGroup id="po-number" label="PO Number:" {...register("poNo", validation.poNo)} error={errors.poNo} />
                                       </div>

                                       {/* <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                                          <div className="col-start-2 col-span-1 w-full">
                                             <InputGroup id="po-number" label="Partial/Deposit:" {...register("deposit")} />
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
                                                   <InputGroup id={`${value}Quantity`} {...register(`${value}Quantity`, validation.quantity)} error={errors[`${value}Quantity`]} onBlur={() => handleOnChange(value)} />
                                                </div>

                                                <div className="col-start-3 col-span-2">
                                                   <InputGroup id={`${value}Unit`} {...register(`${value}Unit`, validation.unit)} error={errors[`${value}Unit`]} />
                                                </div>

                                                <div className="col-start-5 col-span-6">
                                                   <InputGroup id={`${value}Description`} {...register(`${value}Description`, validation.description)} error={errors[`${value}Description`]} />
                                                </div>

                                                <div className="col-start-11 col-span-2">
                                                   <InputGroup id={`${value}NetPrice`} {...register(`${value}NetPrice`, validation.netPrice)} onBlur={() => handleOnChange(value)} error={errors[`${value}NetPrice`]} />
                                                </div>

                                                <div className="col-start-13 col-span-3">
                                                   <div className="flex flex-row justify-start items-center gap-x-2.5">
                                                      <InputGroup id={`${value}Amount`} {...register(`${value}Amount`)} disabled />

                                                      {
                                                         products.length > 1 && (
                                                            <button type="button" onClick={() => handleDeleteProduct(value)}>
                                                               <FontAwesomeIcon className="transition-all ease-in-out duration-300 text-[#B1C2DE] hover:text-[#DE2B2B]" icon={faTrashCan} fixedWidth />
                                                            </button>
                                                         )
                                                      }
                                                   </div>
                                                </div>
                                             </div>
                                          ))
                                       }

                                       <button className="self-start transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="button" onClick={handleAddProduct}>Add Product</button>

                                       <div className="grid grid-cols-5 gap-x-5 w-full">
                                          <div className="col-start-1 col-span-3 flex flex-col gap-y-5">
                                             <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                                                Others
                                             </div>

                                             <div className="grid grid-cols-7 gap-x-2.5">
                                                <div className="col-start-1 col-span-4">
                                                   <InputGroup id="deliver-to" label="Deliver To:" {...register("deliverTo", validation.deliverTo)} error={errors.deliverTo} />
                                                </div>

                                                <div className="col-start-5 col-span-3">
                                                   <InputGroup id="contact" label="Contact:" {...register("contact", validation.contact)} error={errors.contact} />
                                                </div>
                                             </div>

                                             <InputGroup id="terms" label="Terms:" {...register("term", validation.terms)} error={errors.terms} />
                                          </div>

                                          <div className="col-start-4 col-span-2 flex flex-col gap-y-5">
                                             <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                                                Total
                                             </div>

                                             <InputGroup id="subtotal" label="Subtotal:" {...register("subtotal")} defaultValue={subtotal} disabled />

                                             <InputGroup id="balance" label="Balance Due:" {...register("balance")} defaultValue={subtotal} disabled />
                                          </div>
                                       </div>

                                       <div className="grid grid-cols-7 w-full">
                                          <div className="col-start-1 col-span-2">
                                             <div className="flex flex-col justify-start items-start gap-y-3 w-full">
                                                <div className="flex flex-col justify-start items-start gap-y-1">
                                                   <span className="text-accent text-sm font-grandview-bold">
                                                      Purchase Order Document:
                                                   </span>

                                                   <span className="text-xs">Upload Purchase Order Document.</span>

                                                   <span className="text-xs">Accepted file type: *.doc, *.docx, *.pdf</span>
                                                </div>


                                                <label className="hover:cursor-pointer w-full" htmlFor="document">
                                                   <input className="hidden" type="file" accept=".doc, .docx, .pdf" multiple {...register("document", validation.document)} id="document" />

                                                   <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed py-5">
                                                      <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                                                      <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                                                      <div className="flex flex-col gap-y-2.5">
                                                      </div>
                                                   </div>
                                                </label>
                                                {errors?.document && <span className="text-sm text-red-700">{errors.document.message}</span>}
                                                <div className="flex flex-col gap-y-2.5"></div>
                                                {
                                                   poDocuments.map((poDocument, index) => (
                                                      <div className="transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]" key={`floor-plan-${index + 1}`}>
                                                         <span className="line-clamp-1 max-w-[50ch]">{poDocument.name}</span>

                                                         <button type="button" onClick={() => { resetField("document") }}>
                                                            <FontAwesomeIcon icon={faXmark} fixedWidth />
                                                         </button>
                                                      </div>
                                                   ))
                                                }
                                             </div>
                                          </div>
                                       </div>

                                       <div className="self-start flex flex-row justify-start items-center gap-x-5">
                                          <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="submit">Submit</button>

                                          <button className="transition-all ease-in-out duration-300 text-[#333333] tracking-wide rounded-sm bg-[#EBEBEB] px-3 py-1.5 hover:scale-105" type="button" onClick={() => navigate("/accounting/purchase-orders")}>Cancel</button>
                                       </div>
                                    </form>
                                 </main>
                              </Fragment>
   )
}

export default CreatePurchaseOrder