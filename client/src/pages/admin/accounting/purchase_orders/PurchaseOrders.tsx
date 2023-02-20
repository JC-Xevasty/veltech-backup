import { useState, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate, useOutletContext } from "react-router-dom"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { debounce } from "lodash"

import type { OutletContext } from "../../../../types"

import HeaderGroup from "../../../../components/HeaderGroup"
import PaginatedTable from "../../../../components/PaginatedTable"
import SearchInput from "../../../../components/SearchInput"
import StatusGroup from "../../../../components/StatusGroup"
import TableAction from "../../../../components/TableAction"

import LoadingScreen from "../../../misc/LoadingScreen"
import PageError from "../../../misc/PageError"

import { useFetchPurchaseOrderFilteredQuery } from '../../../../features/api/purchaseorder'
import { useSelector } from "react-redux"
import { selectApp } from "../../../../features/app/app"

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
      text: "Fully Paid",
      value: "FULLY_PAID",
      color: "bg-[#D12B2E]"
   },
   PO_SENT: {
      text: "P.O. Sent",
      value: "PO_SENT",
      color: "bg-[#7D1F8C]"
   }
}

interface FieldValues {
   query: string
}

function PurchaseOrders() {
   const app = useSelector(selectApp)

   const navigate = useNavigate()

   const { offset } = useOutletContext() as OutletContext

   const [filter, setFilter] = useState<{ search: string }>({ search: "" })
   const { isLoading: purchaseOrdersLoading, isError: purchaseOrdersError, data: purchaseOrders } = useFetchPurchaseOrderFilteredQuery(filter);

   const [currentPurchaseOrders, setCurrentPurchaseOrders] = useState<typeof purchaseOrders>([])

   const { register, handleSubmit } = useForm<FieldValues>({})

   const handleSearch: SubmitHandler<FieldValues> = (values) => {
      const { query } = values;
      setFilter({ search: query })
   }

   const getStatus = (value: any) => {
      if (value === STATUS.APPROVED.value)
         return STATUS.APPROVED.text
      else if (value === STATUS.FOR_APPROVAL.value)
         return STATUS.FOR_APPROVAL.text
      else if (value === STATUS.FULLY_PAID.value)
         return STATUS.FULLY_PAID.text
      else if (value === STATUS.PARTIALLY_PAID.value)
         return STATUS.PARTIALLY_PAID.text
      else
         return STATUS.PO_SENT.text
   }

   const getStatusColor = (value: any) => {
      if (value === STATUS.APPROVED.value)
         return STATUS.APPROVED.color
      else if (value === STATUS.FOR_APPROVAL.value)
         return STATUS.FOR_APPROVAL.color
      else if (value === STATUS.FULLY_PAID.value)
         return STATUS.FULLY_PAID.color
      else if (value === STATUS.PARTIALLY_PAID.value)
         return STATUS.PARTIALLY_PAID.color
      else
         return STATUS.PO_SENT.color
   }


   const getBalance = (payment: Array<String>, items: any, purchaseOrder: any) => {

      let products = items.map((_: any, index: number) => `product${index + 1}`)
      let total = 0

      products.forEach((value: string, index: number) => {
         total += +purchaseOrder.items[index].quantity * +purchaseOrder.items[index].netPrice
      })

      let totalPayment = 0
      payment.forEach((value: any) => totalPayment += +value)
      return total - totalPayment
   }

   const getDate = (dateString: any) => {
      const D = new Date(dateString);

      return `${D.getMonth() + 1}-${D.getDate()}-${D.getFullYear()}`
   }

   return (
      purchaseOrdersLoading ? <LoadingScreen /> :
         purchaseOrdersError ? <PageError /> :
            <Fragment>
               <Helmet>
                  <title>{`${app?.appName || "Veltech Inc."} | Purchase Orders`}</title>
               </Helmet>

               <div className={`${offset}`}>
                  <main className={`grow flex flex-col justify-start items-start gap-y-5 w-full h-full p-5 px-5`}>
                     <HeaderGroup text="Purchase Orders" />

                     <form className="flex flex-row justify-start items-center gap-x-5" onChange={debounce(handleSubmit(handleSearch), 500)}>
                        <SearchInput placeholder="Seach by supplier name" {...register("query")} />
                     </form>

                     <span className="text-lg">Purchase Order List</span>

                     <PaginatedTable
                        key={ purchaseOrders }
                        columns={[
                           "P.O No.",
                           "Supplier Name",
                           "P.O Date",
                           "Balance",
                           "Status",
                           "Prepared By",
                           "Approved By",
                           "Action"
                        ]}
                        rowData={purchaseOrders}
                        rowsPerPage={ 10 }
                        current={{ set: setCurrentPurchaseOrders }}
                     >
                        {
                           currentPurchaseOrders?.map((purchaseOrder: any, index: number) => (
                              <tr key={ `${ purchaseOrder.poNo }-${ index }` }>
                                 <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                    {purchaseOrder.poNo}
                                 </td>

                                 <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                    {purchaseOrder.supplier.name}
                                 </td>

                                 <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                    {getDate(purchaseOrder.createdAt.toString())}
                                 </td>

                                 <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                    {`PHP ${getBalance(purchaseOrder.payment, purchaseOrder.items, purchaseOrder)}`}
                                 </td>

                                 <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                    <StatusGroup text={getStatus(purchaseOrder.purchaseOrderstatus)} color={getStatusColor(purchaseOrder.purchaseOrderstatus)} />
                                 </td>

                                 <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                    {purchaseOrder.preparedBy.username}
                                 </td>

                                 <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                    {purchaseOrder.approvedBy.username}
                                 </td>

                                 <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                                    <div className="flex flex-row">
                                       <TableAction text="View" icon={faEye} textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#00BDB3]" onClick={() => navigate(`/admin/accounting/purchase-orders/${purchaseOrder.poNo}&${purchaseOrder.projectId}`)} />
                                    </div>
                                 </td>
                              </tr>
                           ))
                        }
                     </PaginatedTable>
                  </main>
               </div>
            </Fragment>
   )
}

export default PurchaseOrders