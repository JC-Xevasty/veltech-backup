import { useState, useEffect, Fragment } from "react"
import { useForm } from "react-hook-form"
import { useParams, useOutletContext } from "react-router-dom"

import type { OutletContext } from "../../../../types"

import HeaderGroup from "../../../../components/HeaderGroup"
import DateGroup from "../../../../components/accounting/DateGroup"
import InputGroup from "../../../../components/accounting/InputGroup"
import SelectGroup from "../../../../components/accounting/SelectGroup"

import { useFetchPurchaseOrderQuery, usePoDocumentUploadsMutation } from "../../../../features/api/purchaseorder"
import { useFetchProjectQuery } from '../../../../features/api/project'
import LoadingScreen from "../../../misc/LoadingScreen"
import PageError from "../../../misc/PageError"
import { useSelector } from "react-redux"
import { selectApp } from "../../../../features/app/app"
import { Helmet } from "react-helmet-async"

interface FieldValues {
   [key: string]: any,
   poNo: string,
   document: FileList,
}

function ViewPurchaseOrder() {
   const app = useSelector(selectApp)

   const { poNo } = useParams() as { poNo: string }

   const dataParams = poNo.split("&")

   const { isError, isLoading, data: purchaseOrder } = useFetchPurchaseOrderQuery({ poNo: dataParams[0] })
   const { isError: projectError, isLoading: projectLoading, data: project } = useFetchProjectQuery({ id: dataParams[1] })
   console.log(project?.user.companyName)

   const { offset } = useOutletContext() as OutletContext

   const [uploadFileMutation] = usePoDocumentUploadsMutation()

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
            poNo: poNo,
            deliverTo: purchaseOrder.deliverTo,
            contact: purchaseOrder.contact,
            term: purchaseOrder.terms,
            subtotal: 0,
            balance: 0,

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


   return (
      isError ? <PageError /> : projectError ? <PageError /> :
      isLoading ? <LoadingScreen /> : projectLoading ? <LoadingScreen /> :
      <Fragment>
         <Helmet>
            <title>{`${app?.appName || "Veltech Inc."} | View Purchase Order`}</title>
         </Helmet>
         
         <main className={ `grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-5 pb-10 ${ offset }` }>
            <HeaderGroup text={ `View Purchase Order ${ dataParams[0] }` } link="/admin/accounting/purchase-orders" />

            <form className="flex flex-col gap-y-5 w-full">
               <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                  Purchase Order Information
               </div>
               
               <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                  <InputGroup id="project" label="Select Project:" { ...register("project") } disabled />
               
                  <DateGroup id="invoice-date" label="Invoice Date:" { ...register("invoiceDate") } disabled />  
               </div>

               <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                  <InputGroup id="supplier" label="Select Supplier:" { ...register("supplier") } disabled />
               
                  <InputGroup id="po-number" label="PO Number:" { ...register("poNo") } disabled />  
               </div>

               {/* <div className="grid grid-cols-3 justify-start items-start gap-x-10 w-full">
                  <div className="col-start-2 col-span-1 w-full">
                     <InputGroup id="po-number" label="Partial/Deposit:" { ...register("deposit") } disabled />
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
                     <div className="grid grid-cols-15 gap-x-2.5" key={ value }>
                        <div className="col-start-1 col-span-2">
                           <InputGroup id={ `${ value }Quantity` } { ...register(`${ value }Quantity`) } disabled />
                        </div>

                        <div className="col-start-3 col-span-2">
                           <InputGroup id={ `${ value }Unit` } { ...register(`${ value }Unit`) } disabled />
                        </div>

                        <div className="col-start-5 col-span-6">
                           <InputGroup id={ `${ value }Description` } { ...register(`${ value }Description`) } disabled />
                        </div>

                        <div className="col-start-11 col-span-2">
                           <InputGroup id={ `${ value }NetPrice` } { ...register(`${ value }NetPrice`) } disabled />
                        </div>

                        <div className="col-start-13 col-span-3">
                           <div className="flex flex-row justify-start items-center gap-x-2.5">
                              <InputGroup id={ `${ value }Amount` } { ...register(`${ value }Amount`) } disabled />
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
                           <InputGroup id="deliver-to" label="Deliver To:" { ...register("deliverTo") } disabled />
                        </div>

                        <div className="col-start-5 col-span-3">
                           <InputGroup id="contact" label="Contact:" { ...register("contact") } disabled /> 
                        </div>
                     </div>

                     <InputGroup id="terms" label="Terms:" { ...register("term") } disabled />
                  </div>

                  <div className="col-start-4 col-span-2 flex flex-col gap-y-5">
                     <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                        Total
                     </div>

                     <InputGroup id="subtotal" label="Subtotal:" { ...register("subtotal") } disabled />

                     <InputGroup id="balance" label="Balance Due:" { ...register("balance") } disabled />
                  </div>
               </div>

               <div className="grid grid-cols-7 w-full">
                  <div className="col-start-1 col-span-2">
                     <div className="flex flex-col justify-start items-start gap-y-3 w-full">
                        <span className="text-accent text-sm font-grandview-bold">
                           Purchase Order Document:
                        </span>

                        <div className="rounded-sm bg-[#E6E8EB] border border-[#E6E8EB] w-[350px] px-2.5 py-1">
                           <span className="text-xs text-[#858585]">{purchaseOrder?.poDocument}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </form>
         </main>
      </Fragment>
      
   )
 }
 
 export default ViewPurchaseOrder