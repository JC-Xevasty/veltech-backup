import { useState, Fragment, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { useParams } from "react-router-dom"
import { faTrashCan, faUpload, faXmarkCircle, faCheckCircle, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"

import { MutationResult, UploadedFile } from "../../../types"

import HeaderGroup from "../../../components/HeaderGroup"
import DateGroup from "../../../components/accounting/DateGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import SelectGroup from "../../../components/accounting/SelectGroup"

import { useCreateProductsMutation, useFetchPurchaseOrderQuery, usePoDocumentUploadsMutation, useDeleteProductMutation, useEditPurchaseOrderMutation } from '../../../features/api/purchaseorder'
import { useFetchProjectQuery, useFetchProjectsByQueryQuery } from '../../../features/api/project'
import { useFetchSuppliersQuery } from '../../../features/api/supplier'
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"

import _ from "lodash"
import PageError from "../../misc/PageError"
import LoadingScreen from "../../misc/LoadingScreen"

import { useCreateActivityMutation } from "../../../features/api/activity.log"

interface FieldValues {
   [key: string]: any,
   poNo: string,
   document: FileList,
}

function zeroFill(number: any, width: any, osign: any) {
   var num = '' + Math.abs(number),
      zerosw = width - num.length,
      sign = number >= 0;
   return (sign ? (osign ? '+' : '') : '-') +
      Math.pow(10, Math.max(0, zerosw)).toString().substr(1) + num;
}

function EditPurchaseOrder() {
   const app = useSelector(selectApp)
   const user = useSelector(selectUser)
   const navigate = useNavigate()

   let currentYear = new Date().getFullYear()

   const { poNo } = useParams() as { poNo: string }
   const dataParams = poNo.split("&")

   const [filter, setFilter] = useState<{ query: string }>({ query: "" })

   const { isError, isLoading, data: purchaseOrder } = useFetchPurchaseOrderQuery({ poNo: dataParams[0] })
   const { isError: projectError, isLoading: projectLoading, data: project } = useFetchProjectQuery({ id: dataParams[1] })
   const { isError: suppliersError, isLoading: suppliersLoading, data: suppliers } = useFetchSuppliersQuery("")
   const { isError: projectsError, isLoading: projectsLoading, data: projects } = useFetchProjectsByQueryQuery(filter)

   const [uploadFileMutation] = usePoDocumentUploadsMutation()
   const [updatePurchaseOrder] = useEditPurchaseOrderMutation()
   const [createProductsMutation] = useCreateProductsMutation()
   const [deleteProduct] = useDeleteProductMutation()
   const [createActivityMutation] = useCreateActivityMutation()

   const [defaults, setDefaults] = useState<any>({})

   const { register, unregister, handleSubmit, watch, reset, setError, getValues, setValue, resetField, formState: { errors } } = useForm<FieldValues>({
      mode: "onChange",
      // TODO: Add default values here OR use "reset" inside a useEffect with the data as dependency with example below
      defaultValues: defaults
   })

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


   const [poDocument] = watch(["document"])
   const [poDocuments, setPoDocuments] = useState<File[]>([])

   useEffect(() => {
      setPoDocuments((poDocuments) => _.filter(poDocument, (doc) => !_.map(poDocuments, (poDocument) => poDocument.name).includes(doc.name)))
   }, [poDocument])

   useEffect(() => {

      if (purchaseOrder) {
         let defaults = {
            project: project?.user.companyName,
            supplier: purchaseOrder.supplier.name,
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
         defaults.subtotal = total
         defaults.balance = getBalance(purchaseOrder.payment, total)
         reset(defaults)
      }
   }, [purchaseOrder, reset])


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
         setValue('subtotal', total)
         return total
      })
   }

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
            lessThan30MB: (floorPlan: FileList) => floorPlan[0]?.size < 30000000 || "Maximum size allowed is 30MB",
            // acceptedFormats: (floorPlan: FileList) => ['application/pdf'].includes(floorPlan[0]?.type) || 'Only PNG, JPEG e GIF',
         }
      }
   };

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

   const handleEdit: SubmitHandler<FieldValues> = async (values) => {
      console.log(values)

      let fileName = purchaseOrder?.poDocument

      const { deliverTo, poNo, supplier, term, project, contact, subtotal: totals } = values

      if (poDocuments.length === 0) {
      } else {
         let formData = new FormData();
         formData.append('file', poDocument[0]);

         const poUploads: MutationResult<UploadedFile> = await uploadFileMutation(formData);

         await createActivityMutation({
            userRole: user.type,
            entry: `${ user.username }-upload-purchase-order`,
            module: "EDIT-PURCHASE-ORDER",
            category: "CREATE",
            status: (poUploads?.data!?.fileName ? "SUCCEEDED" : "FAILED")
          });

         if (poUploads?.data!?.fileName) {
            fileName = poUploads?.data!?.fileName
         }
      }

      const editPurchaseOrder: MutationResult<any> = await updatePurchaseOrder({
         id: purchaseOrder?.id,
         deliverTo: deliverTo,
         contact: contact,
         total: totals,
         terms: term,
         poDocument: fileName
      })

      await createActivityMutation({
         userRole: user.type,
         entry: `${ user.username }-update-purchase-order`,
         module: "EDIT-PURCHASE-ORDER",
         category: "UPDATE",
         status: (editPurchaseOrder?.data!?.id ? "SUCCEEDED" : "FAILED")
       });

      if (editPurchaseOrder?.data!?.id) {
         console.log("OK")

         let purchaseOrderId = editPurchaseOrder?.data!?.id

         const deleteProducts: MutationResult<any> = await deleteProduct({
            purchaseOrderId
         })

         await createActivityMutation({
            userRole: user.type,
            entry: `${ user.username }-delete-product`,
            module: "EDIT-PURCHASE-ORDER",
            category: "DELETE",
            status: (deleteProducts?.data!?.id ? "SUCCEEDED" : "FAILED")
          });

         let index = 1
         let productItemExist = true

         while (productItemExist) {
            const quantity = parseInt(getValues(`product${index}Quantity`))
            const unit = getValues(`product${index}Unit`)
            const description = getValues(`product${index}Description`)
            const netPrice = getValues(`product${index}NetPrice`)

            console.log(netPrice)

            const createProduct: MutationResult<any> = await createProductsMutation({
               purchaseOrderId, quantity, unit, description, netPrice
            })
            
            await createActivityMutation({
               userRole: user.type,
               entry: `${ user.username }-update-purchase-order`,
               module: "EDIT-PURCHASE-ORDER",
               category: "UPDATE",
               status: (editPurchaseOrder?.data!?.id ? "SUCCEEDED" : "FAILED")
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
               <h1 className="text-white font-grandview-bold">Purchase Order Updated!</h1>
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
      isError ? <PageError /> :
         projectsError ? <PageError /> :
            suppliersError ? <PageError /> :
               isLoading ? <LoadingScreen /> :
                  projectsLoading ? <LoadingScreen /> :
                     suppliersLoading ? <LoadingScreen /> :
                        <Fragment>
                           <Helmet>
                           <title>{`${app?.appName || "Veltech Inc."} | Edit P.O. ${ poNo }`}</title>
                           </Helmet>

                           <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
                              <HeaderGroup text={`Edit Purchase Order ${poNo}`} link="/accounting/purchase-orders" />

                              <form className="flex flex-col gap-y-5 w-full" onSubmit={handleSubmit(handleEdit)}>
                                 <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                                    Purchase Order Information
                                 </div>

                                 <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                                    <InputGroup id="project" label="Select Project:" {...register("project")} disabled />
                                    <DateGroup id="invoice-date" label="Invoice Date:" {...register("invoiceDate")} />
                                 </div>

                                 <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                                    <InputGroup id="supplier" label="Select Supplier:" {...register("supplier")} disabled />
                                    <InputGroup id="po-number" label="PO Number:" {...register("poNo")} />
                                 </div>

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
                                             <InputGroup id="deliver-to" label="Deliver To:" {...register("deliverTo")} />
                                          </div>

                                          <div className="col-start-5 col-span-3">
                                             <InputGroup id="contact" label="Contact:" {...register("contact")} />
                                          </div>
                                       </div>

                                       <InputGroup id="terms" label="Terms:" {...register("term")} />
                                    </div>

                                    <div className="col-start-4 col-span-2 flex flex-col gap-y-5">
                                       <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                                          Total
                                       </div>

                                       <InputGroup id="subtotal" label="Subtotal:" {...register("subtotal")} />

                                       <InputGroup id="balance" label="Balance Due:" {...register("balance")} />
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
                                             <input className="hidden" type="file" accept=".doc, .docx, .pdf" multiple {...register("document")} id="document" />

                                             <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed py-5">
                                                <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                                                <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
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
                                          <div className="rounded-sm bg-[#E6E8EB] border border-[#E6E8EB] w-[350px] px-2.5 py-1">
                                             <span className="text-xs text-[#858585]">{purchaseOrder?.poDocument}</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                                 <menu className="self-start flex flex-row justify-start items-center gap-x-5">
                                    <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="submit">Submit</button>

                                    <button className="transition-all ease-in-out duration-300 text-[#333333] tracking-wide rounded-sm bg-[#EBEBEB] px-3 py-1.5 hover:scale-105" type="button" onClick={() => navigate("/accounting/purchase-orders")}>Cancel</button>
                                 </menu>
                              </form>
                           </main>
                        </Fragment>
   )
}

export default EditPurchaseOrder